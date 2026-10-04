const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../database');
const { authenticate, requireRole, auditLog } = require('../middleware/auth');

const router = express.Router();

// =====================================================
// JURY MANAGEMENT (Admin)
// =====================================================

// POST /api/jury — Create jury member account
router.post('/', authenticate, requireRole('super_admin'), async (req, res) => {
  const { email, password, full_name, phone, expertise, affiliation } = req.body;
  if (!email || !password || !full_name) {
    return res.status(400).json({ error: 'Email, password, and full name are required' });
  }

  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const userId = uuidv4();
    const juryMemberId = uuidv4();
    const hash = await bcrypt.hash(password, 12);

    await conn.beginTransaction();
    await conn.query(
      'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [userId, email.toLowerCase(), hash, 'jury']
    );
    await conn.query(
      'INSERT INTO user_profiles (id, user_id, full_name, phone, email_verified) VALUES (?, ?, ?, ?, TRUE)',
      [uuidv4(), userId, full_name, phone || null]
    );
    await conn.query(
      'INSERT INTO jury_members (id, user_id, expertise, affiliation, initial_password) VALUES (?, ?, ?, ?, ?)',
      [juryMemberId, userId, expertise || null, affiliation || null, password]
    );
    await conn.commit();

    await auditLog(req.user.id, 'super_admin', 'jury_created', 'jury_members', juryMemberId, { email, full_name }, req.ip);
    res.status(201).json({ message: 'Jury member created', juryMemberId, userId });
  } catch (err) {
    await conn.rollback();
    console.error('[Jury] Create error:', err.message);
    res.status(500).json({ error: 'Failed to create jury member' });
  } finally {
    conn.release();
  }
});

// GET /api/jury — List all jury members with assignment stats
router.get('/', authenticate, requireRole('super_admin', 'coordinator'), async (req, res) => {
  try {
    const [jury] = await pool.query(
      `SELECT jm.id, jm.expertise, jm.affiliation, jm.initial_password, jm.is_active, jm.created_at,
              u.id as user_id, u.email,
              up.full_name, up.phone,
              (SELECT COUNT(*) FROM jury_assignments ja WHERE ja.jury_member_id = jm.id AND ja.is_active = TRUE) as assigned_count,
              (SELECT COUNT(*) FROM jury_assignments ja JOIN evaluations e ON e.jury_assignment_id = ja.id WHERE ja.jury_member_id = jm.id AND e.status = 'submitted') as evaluated_count
       FROM jury_members jm
       JOIN users u ON u.id = jm.user_id
       LEFT JOIN user_profiles up ON up.user_id = u.id
       ORDER BY jm.created_at DESC`
    );
    res.json({ jury });
  } catch (err) {
    console.error('[Jury] List error:', err.message);
    res.status(500).json({ error: 'Failed to fetch jury members' });
  }
});

// =====================================================
// JURY ASSIGNMENTS (Admin)
// =====================================================

// POST /api/jury/assign — Assign team to jury member
router.post('/assign', authenticate, requireRole('super_admin'), async (req, res) => {
  const { jury_member_id, team_id, round_id } = req.body;
  if (!jury_member_id || !team_id || !round_id) {
    return res.status(400).json({ error: 'jury_member_id, team_id, and round_id are required' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Check jury is active
    const [jury] = await conn.query('SELECT id FROM jury_members WHERE id = ? AND is_active = TRUE', [jury_member_id]);
    if (jury.length === 0) return res.status(404).json({ error: 'Jury member not found or inactive' });

    const assignmentId = uuidv4();

    await conn.query(
      `INSERT INTO jury_assignments (id, jury_member_id, team_id, round_id, assigned_by)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE is_active = TRUE, assigned_by = ?, assigned_at = NOW()`,
      [assignmentId, jury_member_id, team_id, round_id, req.user.id, req.user.id]
    );

    // Create evaluation record
    await conn.query(
      `INSERT IGNORE INTO evaluations (id, jury_assignment_id, team_id, jury_member_id, round_id)
       VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), assignmentId, team_id, jury_member_id, round_id]
    );

    await conn.commit();

    await auditLog(req.user.id, 'super_admin', 'jury_assigned', 'jury_assignments', assignmentId, { jury_member_id, team_id, round_id }, req.ip);
    res.json({ message: 'Jury assigned successfully', assignmentId });
  } catch (err) {
    await conn.rollback();
    console.error('[Jury] Assign error:', err.message);
    res.status(500).json({ error: 'Failed to assign jury' });
  } finally {
    conn.release();
  }
});

// POST /api/jury/assign/bulk — Bulk assign
router.post('/assign/bulk', authenticate, requireRole('super_admin'), async (req, res) => {
  const { jury_member_id, team_ids, round_id } = req.body;
  if (!jury_member_id || !Array.isArray(team_ids) || !round_id) {
    return res.status(400).json({ error: 'jury_member_id, team_ids array, and round_id are required' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    let count = 0;

    for (const team_id of team_ids) {
      const assignmentId = uuidv4();
      await conn.query(
        `INSERT INTO jury_assignments (id, jury_member_id, team_id, round_id, assigned_by)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE is_active = TRUE, assigned_by = ?, assigned_at = NOW()`,
        [assignmentId, jury_member_id, team_id, round_id, req.user.id, req.user.id]
      );
      await conn.query(
        `INSERT IGNORE INTO evaluations (id, jury_assignment_id, team_id, jury_member_id, round_id)
         VALUES (UUID(), (SELECT id FROM jury_assignments WHERE jury_member_id=? AND team_id=? AND round_id=? LIMIT 1), ?, ?, ?)`,
        [jury_member_id, team_id, round_id, team_id, jury_member_id, round_id]
      );
      count++;
    }

    await conn.commit();

    await auditLog(req.user.id, 'super_admin', 'jury_bulk_assigned', 'jury_assignments', jury_member_id, { count, round_id }, req.ip);
    res.json({ message: `${count} teams assigned to jury member` });
  } catch (err) {
    await conn.rollback();
    console.error('[Jury] Bulk assign error:', err.message);
    res.status(500).json({ error: 'Failed to bulk assign' });
  } finally {
    conn.release();
  }
});

// DELETE /api/jury/assign/:id — Remove assignment
router.delete('/assign/:id', authenticate, requireRole('super_admin'), async (req, res) => {
  try {
    await pool.query('UPDATE jury_assignments SET is_active = FALSE WHERE id = ?', [req.params.id]);
    await auditLog(req.user.id, 'super_admin', 'jury_assignment_removed', 'jury_assignments', req.params.id, {}, req.ip);
    res.json({ message: 'Assignment removed' });
  } catch (err) {
    console.error('[Jury] Remove assignment error:', err.message);
    res.status(500).json({ error: 'Failed to remove assignment' });
  }
});

// =====================================================
// JURY DASHBOARD (Jury role)
// =====================================================

// GET /api/jury/my-assignments — Jury: get own assignments
router.get('/my-assignments', authenticate, requireRole('jury'), async (req, res) => {
  try {
    const [jury] = await pool.query('SELECT id FROM jury_members WHERE user_id = ?', [req.user.id]);
    if (jury.length === 0) return res.status(404).json({ error: 'Jury profile not found' });

    const [assignments] = await pool.query(
      `SELECT ja.id as assignment_id, ja.conflict_flagged,
              t.id as team_id, t.team_name, t.registration_number,
              cd.college_name,
              ps.title as problem_title, ps.ps_code, ps.track,
              e.id as evaluation_id, e.status as evaluation_status, e.total_score, e.submitted_at,
              r.name as round_name, r.round_number
       FROM jury_assignments ja
       JOIN teams t ON t.id = ja.team_id
       LEFT JOIN college_details cd ON cd.team_id = t.id
       LEFT JOIN team_problem_selections tps ON tps.team_id = t.id AND tps.is_active = TRUE
       LEFT JOIN problem_statements ps ON ps.id = tps.problem_statement_id
       LEFT JOIN evaluations e ON e.jury_assignment_id = ja.id
       JOIN rounds r ON r.id = ja.round_id
       WHERE ja.jury_member_id = ? AND ja.is_active = TRUE AND ja.conflict_flagged = FALSE
       ORDER BY e.status ASC, t.team_name ASC`,
      [jury[0].id]
    );

    const total = assignments.length;
    const evaluated = assignments.filter(a => a.evaluation_status === 'submitted').length;

    res.json({
      assignments,
      stats: { total, evaluated, pending: total - evaluated }
    });
  } catch (err) {
    console.error('[Jury] My assignments error:', err.message);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// POST /api/jury/conflict/:assignmentId — Flag conflict of interest
router.post('/conflict/:assignmentId', authenticate, requireRole('jury'), async (req, res) => {
  const { reason } = req.body;
  try {
    await pool.query(
      'UPDATE jury_assignments SET conflict_flagged = TRUE, conflict_reason = ? WHERE id = ?',
      [reason || 'Conflict of interest declared', req.params.assignmentId]
    );
    await auditLog(req.user.id, 'jury', 'conflict_flagged', 'jury_assignments', req.params.assignmentId, { reason }, req.ip);
    res.json({ message: 'Conflict flagged. Admin will reassign this team.' });
  } catch (err) {
    console.error('[Jury] Conflict flag error:', err.message);
    res.status(500).json({ error: 'Failed to flag conflict' });
  }
});

// =====================================================
// EVALUATION
// =====================================================

// GET /api/jury/evaluation/:evaluationId — Get evaluation form
router.get('/evaluation/:evaluationId', authenticate, requireRole('jury', 'super_admin'), async (req, res) => {
  try {
    const [evals] = await pool.query(
      `SELECT e.*, ja.jury_member_id, t.team_name, t.registration_number, r.name as round_name
       FROM evaluations e
       JOIN jury_assignments ja ON ja.id = e.jury_assignment_id
       JOIN teams t ON t.id = e.team_id
       JOIN rounds r ON r.id = e.round_id
       WHERE e.id = ?`,
      [req.params.evaluationId]
    );

    if (evals.length === 0) return res.status(404).json({ error: 'Evaluation not found' });
    const ev = evals[0];

    // Jury can only access own evaluations
    if (req.user.role === 'jury') {
      const [jury] = await pool.query('SELECT id FROM jury_members WHERE user_id = ?', [req.user.id]);
      if (jury.length === 0 || jury[0].id !== ev.jury_member_id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const [scores] = await pool.query(
      `SELECT es.score, ec.id as criteria_id, ec.name, ec.description, ec.max_score, ec.display_order
       FROM evaluation_criteria ec
       LEFT JOIN evaluation_scores es ON es.criteria_id = ec.id AND es.evaluation_id = ?
       WHERE ec.round_id = ? AND ec.is_active = TRUE
       ORDER BY ec.display_order ASC`,
      [ev.id, ev.round_id]
    );

    res.json({ evaluation: ev, criteria_scores: scores });
  } catch (err) {
    console.error('[Jury] Get evaluation error:', err.message);
    res.status(500).json({ error: 'Failed to fetch evaluation' });
  }
});

// POST /api/jury/evaluation/:evaluationId — Submit evaluation
router.post('/evaluation/:evaluationId', authenticate, requireRole('jury'), async (req, res) => {
  const { scores, comments } = req.body; // scores = [{ criteria_id, score }]
  if (!Array.isArray(scores) || scores.length === 0) {
    return res.status(400).json({ error: 'Scores array is required' });
  }

  const conn = await pool.getConnection();
  try {
    const [evals] = await conn.query(
      `SELECT e.*, jm.user_id FROM evaluations e
       JOIN jury_assignments ja ON ja.id = e.jury_assignment_id
       JOIN jury_members jm ON jm.id = ja.jury_member_id
       WHERE e.id = ?`,
      [req.params.evaluationId]
    );

    if (evals.length === 0) return res.status(404).json({ error: 'Evaluation not found' });
    const ev = evals[0];

    if (ev.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only submit your own evaluations' });
    }
    if (ev.status === 'locked') {
      return res.status(400).json({ error: 'This evaluation is locked and cannot be modified' });
    }

    // Validate scores against criteria
    const [criteria] = await conn.query(
      'SELECT id, max_score FROM evaluation_criteria WHERE round_id = ? AND is_active = TRUE',
      [ev.round_id]
    );
    const criteriaMap = Object.fromEntries(criteria.map(c => [c.id, c.max_score]));

    let totalScore = 0;
    for (const s of scores) {
      const max = criteriaMap[s.criteria_id];
      if (max === undefined) return res.status(400).json({ error: `Invalid criteria_id: ${s.criteria_id}` });
      if (s.score < 0 || s.score > max) return res.status(400).json({ error: `Score for criteria must be 0–${max}` });
      totalScore += parseFloat(s.score);
    }

    await conn.beginTransaction();

    // Upsert scores
    for (const s of scores) {
      await conn.query(
        `INSERT INTO evaluation_scores (id, evaluation_id, criteria_id, score)
         VALUES (UUID(), ?, ?, ?)
         ON DUPLICATE KEY UPDATE score = VALUES(score)`,
        [ev.id, s.criteria_id, s.score]
      );
    }

    // Update evaluation
    await conn.query(
      `UPDATE evaluations SET total_score=?, comments=?, status='submitted', submitted_at=NOW(), updated_at=NOW() WHERE id=?`,
      [totalScore, comments || null, ev.id]
    );

    await conn.commit();

    await auditLog(req.user.id, 'jury', 'evaluation_submitted', 'evaluations', ev.id, { total_score: totalScore }, req.ip);
    res.json({ message: 'Evaluation submitted successfully', total_score: totalScore });
  } catch (err) {
    await conn.rollback();
    console.error('[Jury] Submit evaluation error:', err.message);
    res.status(500).json({ error: 'Failed to submit evaluation' });
  } finally {
    conn.release();
  }
});

// GET /api/jury/assignments/dashboard — Admin: jury dashboard stats
router.get('/assignments/dashboard', authenticate, requireRole('super_admin', 'coordinator'), async (req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT jm.id as jury_id, up.full_name, u.email,
              COUNT(ja.id) as assigned,
              SUM(CASE WHEN e.status = 'submitted' THEN 1 ELSE 0 END) as evaluated,
              COUNT(ja.id) - SUM(CASE WHEN e.status = 'submitted' THEN 1 ELSE 0 END) as pending
       FROM jury_members jm
       JOIN users u ON u.id = jm.user_id
       LEFT JOIN user_profiles up ON up.user_id = u.id
       LEFT JOIN jury_assignments ja ON ja.jury_member_id = jm.id AND ja.is_active = TRUE
       LEFT JOIN evaluations e ON e.jury_assignment_id = ja.id
       WHERE jm.is_active = TRUE
       GROUP BY jm.id, up.full_name, u.email
       ORDER BY up.full_name`
    );
    res.json({ dashboard: data });
  } catch (err) {
    console.error('[Jury] Dashboard error:', err.message);
    res.status(500).json({ error: 'Failed to fetch jury dashboard' });
  }
});

module.exports = router;
