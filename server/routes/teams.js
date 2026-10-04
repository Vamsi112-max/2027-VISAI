const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../database');
const { authenticate, requireRole, auditLog } = require('../middleware/auth');

const router = express.Router();
const MAX_TEAM_SIZE = parseInt(process.env.MAX_TEAM_MEMBERS || '3'); // max additional members (leader + 3 = 4 total)

// Helper: get active event ID
async function getActiveEventId() {
  const [events] = await pool.query('SELECT id FROM events WHERE is_active = TRUE LIMIT 1');
  if (events.length === 0) throw new Error('No active event found');
  return events[0].id;
}

// Helper: generate registration number
async function generateRegistrationNumber() {
  const [rows] = await pool.query(
    'SELECT COUNT(*) as count FROM teams WHERE registration_number IS NOT NULL'
  );
  const nextNum = String(rows[0].count + 1).padStart(6, '0');
  return `VISAI27-${nextNum}`;
}

// POST /api/teams — Create team (participant only, one team per user)
router.post('/', authenticate, requireRole('participant'), async (req, res) => {
  const { team_name } = req.body;

  if (!team_name || team_name.trim().length < 3) {
    return res.status(400).json({ error: 'Team name must be at least 3 characters' });
  }

  const conn = await pool.getConnection();
  try {
    // Check if user already has a team
    const [existing] = await conn.query(
      'SELECT id FROM teams WHERE leader_user_id = ?',
      [req.user.id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'You already have a team. Each account can only create one team.' });
    }

    const eventId = await getActiveEventId();
    const teamId = uuidv4();

    await conn.beginTransaction();
    await conn.query(
      'INSERT INTO teams (id, event_id, leader_user_id, team_name, status, payment_status) VALUES (?, ?, ?, ?, ?, ?)',
      [teamId, eventId, req.user.id, team_name.trim(), 'draft', 'pending']
    );
    await conn.commit();

    await auditLog(req.user.id, 'participant', 'team_created', 'teams', teamId, { team_name }, req.ip);
    res.status(201).json({ message: 'Team created', teamId, team_name: team_name.trim() });
  } catch (err) {
    await conn.rollback();
    console.error('[Teams] Create error:', err.message);
    res.status(500).json({ error: 'Failed to create team' });
  } finally {
    conn.release();
  }
});

// GET /api/teams/my — Get own team with all details
router.get('/my', authenticate, requireRole('participant'), async (req, res) => {
  try {
    const [teams] = await pool.query(
      `SELECT t.*, e.name as event_name
       FROM teams t
       JOIN events e ON e.id = t.event_id
       WHERE t.leader_user_id = ?`,
      [req.user.id]
    );

    if (teams.length === 0) {
      return res.json({ team: null });
    }

    const team = teams[0];
    const teamId = team.id;

    const [members] = await pool.query(
      'SELECT * FROM team_members WHERE team_id = ? ORDER BY member_order',
      [teamId]
    );
    const [leader] = await pool.query(
      'SELECT * FROM team_leader_details WHERE team_id = ?',
      [teamId]
    );
    const [college] = await pool.query(
      'SELECT * FROM college_details WHERE team_id = ?',
      [teamId]
    );
    const [payment] = await pool.query(
      'SELECT id, status, amount_paise, razorpay_order_id, razorpay_payment_id, created_at FROM payments WHERE team_id = ? ORDER BY created_at DESC LIMIT 1',
      [teamId]
    );
    const [selection] = await pool.query(
      `SELECT tps.*, ps.title as ps_title, ps.ps_code, ps.track, ps.category
       FROM team_problem_selections tps
       JOIN problem_statements ps ON ps.id = tps.problem_statement_id
       WHERE tps.team_id = ? AND tps.is_active = TRUE`,
      [teamId]
    );
    const [submission] = await pool.query(
      `SELECT s.*, r.name as round_name
       FROM submissions s
       JOIN rounds r ON r.id = s.round_id
       WHERE s.team_id = ? ORDER BY s.created_at DESC`,
      [teamId]
    );

    res.json({
      team,
      leader: leader[0] || null,
      members,
      college: college[0] || null,
      payment: payment[0] || null,
      problem_selection: selection[0] || null,
      submissions: submission,
    });
  } catch (err) {
    console.error('[Teams] Get my team error:', err.message);
    res.status(500).json({ error: 'Failed to fetch team data' });
  }
});

// PUT /api/teams/:id/leader — Save team leader details
router.put('/:id/leader', authenticate, requireRole('participant'), async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, college, department, course, year_of_study, student_id, college_id } = req.body;

  if (!full_name || !email || !phone || !college) {
    return res.status(400).json({ error: 'Full name, email, phone, and college are required' });
  }

  try {
    const [teams] = await pool.query('SELECT id FROM teams WHERE id = ? AND leader_user_id = ?', [id, req.user.id]);
    if (teams.length === 0) return res.status(403).json({ error: 'Team not found or access denied' });

    await pool.query(
      `INSERT INTO team_leader_details (id, team_id, full_name, email, phone, college, department, course, year_of_study, student_id, college_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), email=VALUES(email), phone=VALUES(phone),
       college=VALUES(college), department=VALUES(department), course=VALUES(course),
       year_of_study=VALUES(year_of_study), student_id=VALUES(student_id), college_id=VALUES(college_id)`,
      [uuidv4(), id, full_name, email, phone, college, department, course, year_of_study, student_id, college_id]
    );

    res.json({ message: 'Team leader details saved' });
  } catch (err) {
    console.error('[Teams] Leader details error:', err.message);
    res.status(500).json({ error: 'Failed to save leader details' });
  }
});

// PUT /api/teams/:id/members — Save team members (replace all)
router.put('/:id/members', authenticate, requireRole('participant'), async (req, res) => {
  const { id } = req.params;
  const { members } = req.body; // array of member objects

  if (!Array.isArray(members)) {
    return res.status(400).json({ error: 'Members must be an array' });
  }
  if (members.length > MAX_TEAM_SIZE) {
    return res.status(400).json({ error: `Maximum ${MAX_TEAM_SIZE} team members allowed (excluding team leader). Total team size cannot exceed 4.` });
  }

  const conn = await pool.getConnection();
  try {
    const [teams] = await conn.query('SELECT id FROM teams WHERE id = ? AND leader_user_id = ?', [id, req.user.id]);
    if (teams.length === 0) return res.status(403).json({ error: 'Team not found or access denied' });

    await conn.beginTransaction();
    await conn.query('DELETE FROM team_members WHERE team_id = ?', [id]);

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.full_name || !m.email) {
        await conn.rollback();
        return res.status(400).json({ error: `Member ${i + 1}: full_name and email are required` });
      }
      await conn.query(
        `INSERT INTO team_members (id, team_id, member_order, full_name, email, phone, college, department, course, year_of_study, student_id, college_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), id, i + 1, m.full_name, m.email, m.phone || null, m.college || null, m.department || null, m.course || null, m.year_of_study || null, m.student_id || null, m.college_id || null]
      );
    }

    await conn.commit();
    res.json({ message: 'Team members saved', count: members.length });
  } catch (err) {
    await conn.rollback();
    console.error('[Teams] Members error:', err.message);
    res.status(500).json({ error: 'Failed to save team members' });
  } finally {
    conn.release();
  }
});

// PUT /api/teams/:id/college — Save college details
router.put('/:id/college', authenticate, requireRole('participant'), async (req, res) => {
  const { id } = req.params;
  const {
    college_name, department, course, academic_year,
    city, district, state, pincode, address,
    college_email, college_phone, college_website,
    accommodation_acknowledged, travel_mode, arrival_date, departure_date, special_requirements
  } = req.body;

  if (!college_name) return res.status(400).json({ error: 'College name is required' });
  if (!accommodation_acknowledged) return res.status(400).json({ error: 'You must acknowledge the accommodation policy' });

  try {
    const [teams] = await pool.query('SELECT id FROM teams WHERE id = ? AND leader_user_id = ?', [id, req.user.id]);
    if (teams.length === 0) return res.status(403).json({ error: 'Team not found or access denied' });

    await pool.query(
      `INSERT INTO college_details (id, team_id, college_name, department, course, academic_year, city, district, state, pincode, address, college_email, college_phone, college_website, accommodation_acknowledged, travel_mode, arrival_date, departure_date, special_requirements)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE college_name=VALUES(college_name), department=VALUES(department), course=VALUES(course), academic_year=VALUES(academic_year), city=VALUES(city), district=VALUES(district), state=VALUES(state), pincode=VALUES(pincode), address=VALUES(address), college_email=VALUES(college_email), college_phone=VALUES(college_phone), college_website=VALUES(college_website), accommodation_acknowledged=VALUES(accommodation_acknowledged), travel_mode=VALUES(travel_mode), arrival_date=VALUES(arrival_date), departure_date=VALUES(departure_date), special_requirements=VALUES(special_requirements)`,
      [uuidv4(), id, college_name, department, course, academic_year, city, district, state, pincode, address, college_email, college_phone, college_website, accommodation_acknowledged ? 1 : 0, travel_mode, arrival_date || null, departure_date || null, special_requirements]
    );

    // Mark team as registered
    await pool.query("UPDATE teams SET status = 'registered' WHERE id = ?", [id]);

    res.json({ message: 'College details saved' });
  } catch (err) {
    console.error('[Teams] College details error:', err.message);
    res.status(500).json({ error: 'Failed to save college details' });
  }
});

// =====================================================
// ADMIN ROUTES
// =====================================================

// GET /api/teams — Admin: list all teams
router.get('/', authenticate, requireRole('super_admin', 'coordinator'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = 'WHERE 1=1';
    const params = [];

    if (status) { where += ' AND t.status = ?'; params.push(status); }
    if (search) {
      where += ' AND (t.team_name LIKE ? OR t.registration_number LIKE ? OR up.full_name LIKE ?)';
      const q = `%${search}%`;
      params.push(q, q, q);
    }

    const [teams] = await pool.query(
      `SELECT t.id, t.registration_number, t.team_name, t.status, t.payment_status, t.created_at,
              up.full_name as leader_name, u.email as leader_email,
              cd.college_name,
              (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.id) as member_count
       FROM teams t
       LEFT JOIN users u ON u.id = t.leader_user_id
       LEFT JOIN user_profiles up ON up.user_id = u.id
       LEFT JOIN college_details cd ON cd.team_id = t.id
       ${where}
       ORDER BY t.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM teams t
       LEFT JOIN users u ON u.id = t.leader_user_id
       LEFT JOIN user_profiles up ON up.user_id = u.id
       ${where}`,
      params
    );

    res.json({ teams, total: countResult[0].total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('[Teams] List error:', err.message);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// GET /api/teams/:id — Admin: get team details
router.get('/:id', authenticate, requireRole('super_admin', 'coordinator', 'jury'), async (req, res) => {
  const { id } = req.params;

  try {
    const [teams] = await pool.query(
      `SELECT t.*, up.full_name as leader_name, u.email as leader_email
       FROM teams t
       LEFT JOIN users u ON u.id = t.leader_user_id
       LEFT JOIN user_profiles up ON up.user_id = u.id
       WHERE t.id = ?`,
      [id]
    );

    if (teams.length === 0) return res.status(404).json({ error: 'Team not found' });

    const team = teams[0];
    const [members] = await pool.query('SELECT * FROM team_members WHERE team_id = ? ORDER BY member_order', [id]);
    const [leader] = await pool.query('SELECT * FROM team_leader_details WHERE team_id = ?', [id]);
    const [college] = await pool.query('SELECT * FROM college_details WHERE team_id = ?', [id]);
    const [payment] = await pool.query('SELECT * FROM payments WHERE team_id = ? ORDER BY created_at DESC LIMIT 1', [id]);
    const [selection] = await pool.query(
      `SELECT tps.*, ps.title as ps_title, ps.ps_code, ps.track
       FROM team_problem_selections tps
       JOIN problem_statements ps ON ps.id = tps.problem_statement_id
       WHERE tps.team_id = ? AND tps.is_active = TRUE`,
      [id]
    );
    const [submissions] = await pool.query(
      `SELECT s.*, r.name as round_name FROM submissions s
       JOIN rounds r ON r.id = s.round_id
       WHERE s.team_id = ? ORDER BY s.created_at DESC`,
      [id]
    );

    res.json({ team, leader: leader[0] || null, members, college: college[0] || null, payment: payment[0] || null, problem_selection: selection[0] || null, submissions });
  } catch (err) {
    console.error('[Teams] Get error:', err.message);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// GET /api/teams/stats/overview — Admin stats
router.get('/stats/overview', authenticate, requireRole('super_admin', 'coordinator'), async (req, res) => {
  try {
    const [[stats]] = await pool.query(`
      SELECT
        COUNT(*) as total_teams,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_teams,
        SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending_payment,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_teams
      FROM teams
    `);
    const [[submissionStats]] = await pool.query(`
      SELECT COUNT(*) as total_submissions FROM submissions WHERE status = 'submitted'
    `);
    const [[evaluationStats]] = await pool.query(`
      SELECT
        COUNT(*) as total_evaluations,
        SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as completed_evaluations
      FROM evaluations
    `);
    res.json({
      ...stats,
      total_submissions: submissionStats?.total_submissions || 0,
      total_evaluations: evaluationStats?.total_evaluations || 0,
      completed_evaluations: evaluationStats?.completed_evaluations || 0
    });
  } catch (err) {
    console.error('[Teams] Stats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch team statistics' });
  }
});

// PUT /api/teams/:id/lock — Admin locks / unlocks team registration
router.put('/:id/lock', authenticate, requireRole('super_admin'), async (req, res) => {
  const { is_locked } = req.body;
  try {
    await pool.query('UPDATE teams SET is_locked = ? WHERE id = ?', [is_locked ? 1 : 0, req.params.id]);
    await auditLog(req.user.id, 'super_admin', is_locked ? 'team_locked' : 'team_unlocked', 'teams', req.params.id, { is_locked }, req.ip);
    res.json({ message: is_locked ? 'Team registration locked' : 'Team registration unlocked', is_locked });
  } catch (err) {
    console.error('[Teams] Lock team error:', err.message);
    res.status(500).json({ error: 'Failed to update lock status' });
  }
});

// PUT /api/teams/admin/lock-all — Admin master switch to lock all registrations
router.put('/admin/lock-all', authenticate, requireRole('super_admin'), async (req, res) => {
  const { is_locked } = req.body;
  try {
    await pool.query('UPDATE teams SET is_locked = ?', [is_locked ? 1 : 0]);
    await auditLog(req.user.id, 'super_admin', is_locked ? 'all_teams_locked' : 'all_teams_unlocked', 'teams', 'all', { is_locked }, req.ip);
    res.json({ message: is_locked ? 'All team registrations locked' : 'All team registrations unlocked', is_locked });
  } catch (err) {
    console.error('[Teams] Lock all teams error:', err.message);
    res.status(500).json({ error: 'Failed to lock all teams' });
  }
});

module.exports = router;
