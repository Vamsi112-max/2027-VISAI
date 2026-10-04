const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../database');
const { authenticate, requireRole, auditLog } = require('../middleware/auth');

const router = express.Router();

// =====================================================
// RESULTS
// =====================================================

// GET /api/results — Public: published results only
router.get('/', async (req, res) => {
  try {
    const { round_id } = req.query;
    let where = 'WHERE r.is_published = TRUE';
    const params = [];
    if (round_id) { where += ' AND r.round_id = ?'; params.push(round_id); }

    const [results] = await pool.query(
      `SELECT r.published_status as status, r.award, r.rank,
              t.team_name, t.registration_number,
              cd.college_name,
              ps.title as problem_title, ps.ps_code, ps.track,
              rnd.name as round_name, rnd.round_number,
              AVG(e.total_score) as average_score
       FROM results r
       JOIN teams t ON t.id = r.team_id
       LEFT JOIN college_details cd ON cd.team_id = t.id
       LEFT JOIN team_problem_selections tps ON tps.team_id = t.id AND tps.is_active = TRUE
       LEFT JOIN problem_statements ps ON ps.id = tps.problem_statement_id
       JOIN rounds rnd ON rnd.id = r.round_id
       LEFT JOIN evaluations e ON e.team_id = t.id AND e.round_id = r.round_id AND e.status = 'submitted'
       ${where}
       GROUP BY r.id
       ORDER BY r.rank ASC, r.published_at DESC`,
      params
    );

    res.json({ results });
  } catch (err) {
    console.error('[Results] List error:', err.message);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// GET /api/results/my — Participant: see own published result
router.get('/my', authenticate, requireRole('participant'), async (req, res) => {
  try {
    const [teams] = await pool.query('SELECT id FROM teams WHERE leader_user_id = ?', [req.user.id]);
    if (teams.length === 0) return res.json({ results: [] });

    const [results] = await pool.query(
      `SELECT r.*, rnd.name as round_name, rnd.round_number
       FROM results r
       JOIN rounds rnd ON rnd.id = r.round_id
       WHERE r.team_id = ? AND r.is_published = TRUE
       ORDER BY rnd.round_number ASC`,
      [teams[0].id]
    );

    res.json({ results });
  } catch (err) {
    console.error('[Results] My results error:', err.message);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// =====================================================
// ADMIN RESULT MANAGEMENT
// =====================================================

// GET /api/results/admin — Admin: all results (internal)
router.get('/admin', authenticate, requireRole('super_admin'), async (req, res) => {
  try {
    const { round_id } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (round_id) { where += ' AND r.round_id = ?'; params.push(round_id); }

    const [results] = await pool.query(
      `SELECT r.*,
              t.team_name, t.registration_number,
              cd.college_name,
              rnd.name as round_name, rnd.round_number,
              AVG(e.total_score) as average_score,
              COUNT(e.id) as evaluation_count
       FROM results r
       JOIN teams t ON t.id = r.team_id
       LEFT JOIN college_details cd ON cd.team_id = t.id
       JOIN rounds rnd ON rnd.id = r.round_id
       LEFT JOIN evaluations e ON e.team_id = t.id AND e.round_id = r.round_id AND e.status = 'submitted'
       ${where}
       GROUP BY r.id
       ORDER BY average_score DESC`,
      params
    );

    res.json({ results });
  } catch (err) {
    console.error('[Results] Admin list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// POST /api/results/finalize — Admin: set internal result for a team
router.post('/finalize', authenticate, requireRole('super_admin'), async (req, res) => {
  const { team_id, round_id, status, award, rank, notes } = req.body;
  if (!team_id || !round_id || !status) {
    return res.status(400).json({ error: 'team_id, round_id, and status are required' });
  }

  try {
    await pool.query(
      `INSERT INTO results (id, team_id, round_id, internal_status, award, rank, notes, finalized_by, finalized_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE internal_status=VALUES(internal_status), award=VALUES(award), rank=VALUES(rank), notes=VALUES(notes), finalized_by=VALUES(finalized_by), finalized_at=NOW()`,
      [uuidv4(), team_id, round_id, status, award || null, rank || null, notes || null, req.user.id]
    );

    await auditLog(req.user.id, 'super_admin', 'result_finalized', 'results', team_id, { round_id, status, award }, req.ip);
    res.json({ message: 'Result finalized' });
  } catch (err) {
    console.error('[Results] Finalize error:', err.message);
    res.status(500).json({ error: 'Failed to finalize result' });
  }
});

// POST /api/results/publish — Admin: publish results for a round
router.post('/publish', authenticate, requireRole('super_admin'), async (req, res) => {
  const { round_id } = req.body;
  if (!round_id) return res.status(400).json({ error: 'round_id is required' });

  try {
    const [result] = await pool.query(
      `UPDATE results SET
         published_status = internal_status,
         is_published = TRUE,
         published_at = NOW()
       WHERE round_id = ? AND internal_status != 'pending'`,
      [round_id]
    );

    await auditLog(req.user.id, 'super_admin', 'results_published', 'results', round_id, { affected: result.affectedRows }, req.ip);
    res.json({ message: `Results published for round. ${result.affectedRows} team(s) updated.` });
  } catch (err) {
    console.error('[Results] Publish error:', err.message);
    res.status(500).json({ error: 'Failed to publish results' });
  }
});

// POST /api/results/unpublish — Admin: unpublish (revert)
router.post('/unpublish', authenticate, requireRole('super_admin'), async (req, res) => {
  const { round_id } = req.body;
  if (!round_id) return res.status(400).json({ error: 'round_id is required' });

  try {
    await pool.query('UPDATE results SET is_published = FALSE WHERE round_id = ?', [round_id]);
    await auditLog(req.user.id, 'super_admin', 'results_unpublished', 'results', round_id, {}, req.ip);
    res.json({ message: 'Results unpublished' });
  } catch (err) {
    console.error('[Results] Unpublish error:', err.message);
    res.status(500).json({ error: 'Failed to unpublish results' });
  }
});

// =====================================================
// CHECK-IN (Coordinator)
// =====================================================

// GET /api/checkin/search — Search team for check-in
router.get('/checkin/search', authenticate, requireRole('coordinator', 'super_admin'), async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Search query required' });

  try {
    const [teams] = await pool.query(
      `SELECT t.id, t.registration_number, t.team_name, t.payment_status,
              up.full_name as leader_name, u.email as leader_email,
              cd.college_name,
              (SELECT COUNT(*) FROM checkins ci WHERE ci.team_id = t.id) as checkin_count
       FROM teams t
       JOIN users u ON u.id = t.leader_user_id
       LEFT JOIN user_profiles up ON up.user_id = u.id
       LEFT JOIN college_details cd ON cd.team_id = t.id
       WHERE t.registration_number LIKE ? OR t.team_name LIKE ? OR up.full_name LIKE ? OR u.email LIKE ?
       LIMIT 10`,
      [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
    );
    res.json({ teams });
  } catch (err) {
    console.error('[Checkin] Search error:', err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

// POST /api/checkin — Check in a team
router.post('/checkin', authenticate, requireRole('coordinator', 'super_admin'), async (req, res) => {
  const { team_id, notes } = req.body;
  if (!team_id) return res.status(400).json({ error: 'team_id is required' });

  try {
    const [teams] = await pool.query(
      "SELECT id, team_name, payment_status FROM teams WHERE id = ?",
      [team_id]
    );
    if (teams.length === 0) return res.status(404).json({ error: 'Team not found' });
    if (teams[0].payment_status !== 'paid') {
      return res.status(400).json({ error: 'Team has not completed payment and cannot be checked in' });
    }

    await pool.query(
      'INSERT INTO checkins (id, team_id, checked_in_by, notes) VALUES (?, ?, ?, ?)',
      [uuidv4(), team_id, req.user.id, notes || null]
    );

    await auditLog(req.user.id, req.user.role, 'team_checked_in', 'checkins', team_id, { team_name: teams[0].team_name }, req.ip);
    res.json({ message: `${teams[0].team_name} checked in successfully` });
  } catch (err) {
    console.error('[Checkin] Check in error:', err.message);
    res.status(500).json({ error: 'Failed to check in team' });
  }
});

module.exports = router;
