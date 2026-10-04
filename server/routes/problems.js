const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../database');
const { authenticate, requireRole, auditLog } = require('../middleware/auth');

const router = express.Router();

// Helper: get current active event
async function getActiveEvent() {
  const [events] = await pool.query('SELECT id FROM events WHERE is_active = TRUE LIMIT 1');
  if (events.length === 0) throw new Error('No active event');
  return events[0];
}

// =====================================================
// PUBLIC ROUTES
// =====================================================

// GET /api/problem-statements — Public: published problems with capacity
router.get('/', async (req, res) => {
  try {
    const { round_id, track } = req.query;
    let where = "WHERE ps.status = 'published'";
    const params = [];

    if (round_id) { where += ' AND ps.round_id = ?'; params.push(round_id); }
    if (track) { where += ' AND ps.track = ?'; params.push(track); }

    const [problems] = await pool.query(
      `SELECT ps.*,
              (SELECT COUNT(*) FROM team_problem_selections tps
               WHERE tps.problem_statement_id = ps.id AND tps.is_active = TRUE) as registered_count,
              (ps.max_capacity - (SELECT COUNT(*) FROM team_problem_selections tps
               WHERE tps.problem_statement_id = ps.id AND tps.is_active = TRUE)) as remaining_capacity
       FROM problem_statements ps
       ${where}
       ORDER BY ps.created_at ASC`,
      params
    );

    res.json({ problems });
  } catch (err) {
    console.error('[PS] List error:', err.message);
    res.status(500).json({ error: 'Failed to fetch problem statements' });
  }
});

// GET /api/problem-statements/:id — Public: single problem details
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ps.*,
              (SELECT COUNT(*) FROM team_problem_selections tps
               WHERE tps.problem_statement_id = ps.id AND tps.is_active = TRUE) as registered_count
       FROM problem_statements ps
       WHERE ps.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Problem statement not found' });
    const ps = rows[0];
    ps.remaining_capacity = ps.max_capacity - ps.registered_count;
    res.json({ problem: ps });
  } catch (err) {
    console.error('[PS] Get error:', err.message);
    res.status(500).json({ error: 'Failed to fetch problem statement' });
  }
});

// =====================================================
// PARTICIPANT: SELECT PROBLEM STATEMENT
// =====================================================

// POST /api/problem-statements/:id/select — Atomic capacity-safe selection
router.post('/:id/select', authenticate, requireRole('participant'), async (req, res) => {
  const { id: problemId } = req.params;

  const conn = await pool.getConnection();
  try {
    // Must have paid team
    const [teams] = await conn.query(
      "SELECT id FROM teams WHERE leader_user_id = ? AND payment_status = 'paid'",
      [req.user.id]
    );
    if (teams.length === 0) {
      return res.status(403).json({ error: 'You must complete payment before selecting a problem statement' });
    }
    const teamId = teams[0].id;

    // Get active round
    const [rounds] = await conn.query(
      "SELECT id FROM rounds WHERE status = 'open' ORDER BY round_number ASC LIMIT 1"
    );
    if (rounds.length === 0) {
      return res.status(400).json({ error: 'No active round for problem selection' });
    }
    const roundId = rounds[0].id;

    // Use SELECT FOR UPDATE to prevent race conditions
    await conn.beginTransaction();

    const [ps] = await conn.query(
      "SELECT id, status, max_capacity FROM problem_statements WHERE id = ? FOR UPDATE",
      [problemId]
    );

    if (ps.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Problem statement not found' });
    }

    if (ps[0].status !== 'published') {
      await conn.rollback();
      return res.status(400).json({ error: 'This problem statement is not available for selection' });
    }

    // Count current registrations (within transaction for consistency)
    const [[{ count }]] = await conn.query(
      "SELECT COUNT(*) as count FROM team_problem_selections WHERE problem_statement_id = ? AND is_active = TRUE",
      [problemId]
    );

    if (count >= ps[0].max_capacity) {
      await conn.rollback();
      return res.status(409).json({ error: 'This problem statement is full. Please select another.' });
    }

    // Deactivate any previous selection for this round
    await conn.query(
      "UPDATE team_problem_selections SET is_active = FALSE, deselected_at = NOW() WHERE team_id = ? AND round_id = ? AND is_active = TRUE",
      [teamId, roundId]
    );

    // Create new selection
    await conn.query(
      'INSERT INTO team_problem_selections (id, team_id, problem_statement_id, round_id, is_active) VALUES (?, ?, ?, ?, TRUE)',
      [uuidv4(), teamId, problemId, roundId]
    );

    await conn.commit();

    await auditLog(req.user.id, 'participant', 'problem_selected', 'team_problem_selections', teamId, { problemId }, req.ip);

    res.json({ success: true, message: 'Problem statement selected successfully' });
  } catch (err) {
    await conn.rollback();
    console.error('[PS] Select error:', err.message);
    res.status(500).json({ error: 'Failed to select problem statement' });
  } finally {
    conn.release();
  }
});

// =====================================================
// ADMIN ROUTES
// =====================================================

// POST /api/problem-statements — Admin: create
router.post('/', authenticate, requireRole('super_admin'), async (req, res) => {
  const {
    ps_code, title, short_description, full_description,
    track, category, max_capacity, status,
    selection_starts_at, selection_ends_at, instructions, reference_material, round_id
  } = req.body;

  if (!title || !ps_code) {
    return res.status(400).json({ error: 'Title and problem statement code are required' });
  }

  try {
    const event = await getActiveEvent();
    const id = uuidv4();

    let createdBy = req.user?.id || null;
    if (createdBy) {
      const [u] = await pool.query('SELECT id FROM users WHERE id = ?', [createdBy]);
      if (!u || u.length === 0) {
        const [uByEmail] = await pool.query('SELECT id FROM users WHERE email = ?', [req.user?.email || 'admin@visai.in']);
        createdBy = uByEmail?.[0]?.id || null;
      }
    }

    await pool.query(
      `INSERT INTO problem_statements (id, event_id, round_id, ps_code, title, short_description, full_description, track, category, max_capacity, status, selection_starts_at, selection_ends_at, instructions, reference_material, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, event.id, round_id || null, ps_code, title, short_description, full_description, track, category, max_capacity || 25, status || 'published', selection_starts_at || null, selection_ends_at || null, instructions, reference_material, createdBy]
    );

    await auditLog(req.user.id, 'super_admin', 'problem_created', 'problem_statements', id, { title, ps_code }, req.ip);
    res.status(201).json({ message: 'Problem statement created', id, ps_code });
  } catch (err) {
    if (err.message.includes('Duplicate')) {
      return res.status(409).json({ error: 'A problem statement with this code already exists' });
    }
    console.error('[PS] Create error:', err.message);
    res.status(500).json({ error: 'Failed to create problem statement: ' + err.message });
  }
});

// PUT /api/problem-statements/:id — Admin: update
router.put('/:id', authenticate, requireRole('super_admin'), async (req, res) => {
  const { id } = req.params;
  const {
    title, short_description, full_description, track, category,
    max_capacity, status, selection_starts_at, selection_ends_at,
    instructions, reference_material, round_id
  } = req.body;

  try {
    await pool.query(
      `UPDATE problem_statements SET
        title=?, short_description=?, full_description=?, track=?, category=?,
        max_capacity=?, status=?, selection_starts_at=?, selection_ends_at=?,
        instructions=?, reference_material=?, round_id=?
       WHERE id = ?`,
      [title, short_description, full_description, track, category, max_capacity, status, selection_starts_at || null, selection_ends_at || null, instructions, reference_material, round_id || null, id]
    );

    await auditLog(req.user.id, 'super_admin', 'problem_updated', 'problem_statements', id, { title, status }, req.ip);
    res.json({ message: 'Problem statement updated' });
  } catch (err) {
    console.error('[PS] Update error:', err.message);
    res.status(500).json({ error: 'Failed to update problem statement' });
  }
});

// DELETE /api/problem-statements/:id — Admin: safe delete/archive
router.delete('/:id', authenticate, requireRole('super_admin'), async (req, res) => {
  const { id } = req.params;
  const { force } = req.query;

  try {
    // Check if any teams depend on this problem statement
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) as count FROM team_problem_selections WHERE problem_statement_id = ?',
      [id]
    );

    if (count > 0) {
      if (force === 'archive') {
        await pool.query("UPDATE problem_statements SET status = 'archived' WHERE id = ?", [id]);
        await auditLog(req.user.id, 'super_admin', 'problem_archived', 'problem_statements', id, { count }, req.ip);
        return res.json({ message: `Problem statement archived (${count} teams had selected it)` });
      }
      return res.status(409).json({
        error: `Cannot delete: ${count} team(s) have selected this problem statement.`,
        suggestion: 'Use force=archive to archive instead of deleting.',
        count,
      });
    }

    await pool.query('DELETE FROM problem_statements WHERE id = ?', [id]);
    await auditLog(req.user.id, 'super_admin', 'problem_deleted', 'problem_statements', id, {}, req.ip);
    res.json({ message: 'Problem statement deleted' });
  } catch (err) {
    console.error('[PS] Delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete problem statement' });
  }
});

// Admin: list all (includes drafts, archived)
router.get('/admin/all', authenticate, requireRole('super_admin', 'coordinator'), async (req, res) => {
  try {
    const [problems] = await pool.query(
      `SELECT ps.*,
              (SELECT COUNT(*) FROM team_problem_selections tps WHERE tps.problem_statement_id = ps.id AND tps.is_active = TRUE) as registered_count,
              (SELECT COUNT(*) FROM submissions s JOIN team_problem_selections tps ON tps.team_id = s.team_id WHERE tps.problem_statement_id = ps.id AND s.status = 'submitted') as submission_count
       FROM problem_statements ps
       ORDER BY ps.created_at DESC`
    );
    res.json({ problems });
  } catch (err) {
    console.error('[PS] Admin list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch problem statements' });
  }
});

module.exports = router;
