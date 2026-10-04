const express = require('express');
const pool = require('../database');
const { authenticate, requireRole, auditLog } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/dashboard — Overview stats
router.get('/dashboard', authenticate, requireRole('super_admin'), async (req, res) => {
  try {
    const [[teamStats]] = await pool.query(`
      SELECT
        COUNT(*) as total_teams,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_teams,
        SUM(CASE WHEN payment_status IN ('pending','order_created','payment_attempted') THEN 1 ELSE 0 END) as pending_payment_teams,
        SUM(CASE WHEN payment_status = 'failed' THEN 1 ELSE 0 END) as failed_payment_teams
      FROM teams
    `);

    const [[submissionStats]] = await pool.query(`
      SELECT
        COUNT(*) as total_submissions,
        SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted,
        SUM(CASE WHEN status = 'under_review' THEN 1 ELSE 0 END) as under_review,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted
      FROM submissions
    `);

    const [[juryStats]] = await pool.query(`
      SELECT
        COUNT(DISTINCT jm.id) as total_jury,
        COUNT(ja.id) as total_assignments,
        SUM(CASE WHEN e.status = 'submitted' THEN 1 ELSE 0 END) as completed_evaluations,
        COUNT(ja.id) - SUM(CASE WHEN e.status = 'submitted' THEN 1 ELSE 0 END) as pending_evaluations
      FROM jury_members jm
      LEFT JOIN jury_assignments ja ON ja.jury_member_id = jm.id AND ja.is_active = TRUE
      LEFT JOIN evaluations e ON e.jury_assignment_id = ja.id
    `);

    const [[psStats]] = await pool.query(`
      SELECT
        COUNT(*) as total_ps,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_ps,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_ps
      FROM problem_statements
    `);

    const [[resultStats]] = await pool.query(`
      SELECT
        SUM(CASE WHEN is_published = TRUE AND published_status = 'selected' THEN 1 ELSE 0 END) as selected_teams,
        SUM(CASE WHEN is_published = TRUE AND published_status = 'rejected' THEN 1 ELSE 0 END) as rejected_teams
      FROM results
    `);

    // Recent activity
    const [recentActivity] = await pool.query(`
      SELECT actor_role, action, entity_type, entity_id, created_at, metadata
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 15
    `);

    res.json({
      teams: teamStats,
      submissions: submissionStats,
      jury: juryStats,
      problem_statements: psStats,
      results: resultStats,
      recent_activity: recentActivity,
    });
  } catch (err) {
    console.error('[Admin] Dashboard error:', err.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET /api/admin/audit-logs
router.get('/audit-logs', authenticate, requireRole('super_admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [logs] = await pool.query(
      `SELECT al.*, up.full_name as actor_name, u.email as actor_email
       FROM audit_logs al
       LEFT JOIN users u ON u.id = al.actor_id
       LEFT JOIN user_profiles up ON up.user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), offset]
    );

    res.json({ logs });
  } catch (err) {
    console.error('[Admin] Audit logs error:', err.message);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// GET /api/admin/event-settings (Public or Admin read)
router.get('/event-settings', async (req, res) => {
  try {
    const [settings] = await pool.query(
      `SELECT es.* FROM event_settings es JOIN events e ON e.id = es.event_id WHERE e.is_active = TRUE`
    );
    res.json({ settings });
  } catch (err) {
    console.error('[Admin] Event settings error:', err.message);
    res.status(500).json({ error: 'Failed to fetch event settings' });
  }
});

// PUT /api/admin/event-settings/:key (Upsert setting in DB)
router.put('/event-settings/:key', authenticate, requireRole('super_admin'), async (req, res) => {
  const { value } = req.body;
  const settingKey = req.params.key;
  try {
    const [[event]] = await pool.query('SELECT id FROM events WHERE is_active = TRUE LIMIT 1');
    const eventId = event?.id || 'ev-2027';

    // Check if setting exists
    const [existing] = await pool.query(
      'SELECT id FROM event_settings WHERE event_id = ? AND setting_key = ?',
      [eventId, settingKey]
    );

    if (existing && existing.length > 0) {
      await pool.query(
        'UPDATE event_settings SET setting_value = ? WHERE event_id = ? AND setting_key = ?',
        [value, eventId, settingKey]
      );
    } else {
      const settingId = `set-${Date.now()}`;
      await pool.query(
        'INSERT INTO event_settings (id, event_id, setting_key, setting_value, setting_type) VALUES (?, ?, ?, ?, ?)',
        [settingId, eventId, settingKey, value, 'json']
      );
    }

    await auditLog(req.user.id, 'super_admin', 'setting_updated', 'event_settings', settingKey, { value: value?.slice(0, 100) }, req.ip);
    res.json({ success: true, message: `Setting "${settingKey}" saved and synchronized to database!` });
  } catch (err) {
    console.error('[Admin] Update setting error:', err.message);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// GET /api/admin/rounds
router.get('/rounds', authenticate, requireRole('super_admin', 'coordinator'), async (req, res) => {
  try {
    const [[event]] = await pool.query('SELECT id FROM events WHERE is_active = TRUE LIMIT 1');
    const [rounds] = await pool.query('SELECT * FROM rounds WHERE event_id = ? ORDER BY round_number', [event.id]);
    res.json({ rounds });
  } catch (err) {
    console.error('[Admin] Rounds error:', err.message);
    res.status(500).json({ error: 'Failed to fetch rounds' });
  }
});

// POST /api/admin/rounds
router.post('/rounds', authenticate, requireRole('super_admin'), async (req, res) => {
  const { round_number, name, description, starts_at, ends_at, submission_deadline, status } = req.body;
  const { v4: uuidv4 } = require('uuid');
  try {
    const [[event]] = await pool.query('SELECT id FROM events WHERE is_active = TRUE LIMIT 1');
    const id = uuidv4();
    await pool.query(
      'INSERT INTO rounds (id, event_id, round_number, name, description, starts_at, ends_at, submission_deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, event.id, round_number, name, description, starts_at || null, ends_at || null, submission_deadline || null, status || 'upcoming']
    );
    await auditLog(req.user.id, 'super_admin', 'round_created', 'rounds', id, { round_number, name }, req.ip);
    res.status(201).json({ message: 'Round created', id });
  } catch (err) {
    console.error('[Admin] Create round error:', err.message);
    res.status(500).json({ error: 'Failed to create round' });
  }
});

// PUT /api/admin/rounds/:id
router.put('/rounds/:id', authenticate, requireRole('super_admin'), async (req, res) => {
  const { name, description, starts_at, ends_at, submission_deadline, status } = req.body;
  try {
    await pool.query(
      'UPDATE rounds SET name=?, description=?, starts_at=?, ends_at=?, submission_deadline=?, status=? WHERE id=?',
      [name, description, starts_at || null, ends_at || null, submission_deadline || null, status, req.params.id]
    );
    await auditLog(req.user.id, 'super_admin', 'round_updated', 'rounds', req.params.id, { status }, req.ip);
    res.json({ message: 'Round updated' });
  } catch (err) {
    console.error('[Admin] Update round error:', err.message);
    res.status(500).json({ error: 'Failed to update round' });
  }
});

// GET /api/admin/evaluation-criteria
router.get('/evaluation-criteria', authenticate, requireRole('super_admin'), async (req, res) => {
  try {
    const { round_id } = req.query;
    let where = 'WHERE ec.is_active = TRUE';
    const params = [];
    if (round_id) { where += ' AND ec.round_id = ?'; params.push(round_id); }
    const [criteria] = await pool.query(`SELECT * FROM evaluation_criteria ${where} ORDER BY display_order`, params);
    res.json({ criteria });
  } catch (err) {
    console.error('[Admin] Criteria error:', err.message);
    res.status(500).json({ error: 'Failed to fetch criteria' });
  }
});

// PUT /api/admin/teams/:id/status
router.put('/teams/:id/status', authenticate, requireRole('super_admin', 'coordinator'), async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE teams SET status = ? WHERE id = ?', [status, req.params.id]);
    await auditLog(req.user.id, req.user.role, 'team_status_updated', 'teams', req.params.id, { status }, req.ip);
    res.json({ message: 'Team status updated', status });
  } catch (err) {
    console.error('[Admin] Update team status error:', err.message);
    res.status(500).json({ error: 'Failed to update team status' });
  }
});

// PUT /api/admin/teams/:id/payment
router.put('/teams/:id/payment', authenticate, requireRole('super_admin'), async (req, res) => {
  const { payment_status } = req.body;
  try {
    await pool.query('UPDATE teams SET payment_status = ? WHERE id = ?', [payment_status, req.params.id]);
    await auditLog(req.user.id, 'super_admin', 'team_payment_updated', 'teams', req.params.id, { payment_status }, req.ip);
    res.json({ message: 'Payment status updated', payment_status });
  } catch (err) {
    console.error('[Admin] Update team payment error:', err.message);
    res.status(500).json({ error: 'Failed to update team payment status' });
  }
});

// CSV Export: Teams
router.get('/export/teams', authenticate, requireRole('super_admin'), async (req, res) => {
  try {
    const [teams] = await pool.query(`
      SELECT t.registration_number, t.team_name, t.status, t.payment_status, t.created_at,
             up.full_name as leader_name, u.email as leader_email, up.phone as leader_phone,
             cd.college_name, cd.department, cd.course, cd.city, cd.state,
             (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.id) + 1 as total_members
      FROM teams t
      LEFT JOIN users u ON u.id = t.leader_user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      LEFT JOIN college_details cd ON cd.team_id = t.id
      ORDER BY t.created_at DESC
    `);

    const headers = Object.keys(teams[0] || {}).join(',');
    const rows = teams.map(r => Object.values(r).map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','));
    const csv = [headers, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="visai2027_teams.csv"');
    res.send(csv);
  } catch (err) {
    console.error('[Admin] Export teams error:', err.message);
    res.status(500).json({ error: 'Failed to export teams' });
  }
});

// GET /api/admin/db/status — TiDB & Safety Storage status
router.get('/db/status', authenticate, requireRole('super_admin'), async (req, res) => {
  try {
    const status = await pool.getDbStatus();
    res.json(status);
  } catch (err) {
    console.error('[Admin] DB status error:', err.message);
    res.status(500).json({ error: 'Failed to fetch database status' });
  }
});

// POST /api/admin/db/sync-backup — Trigger immediate snapshot & safety sync
router.post('/db/sync-backup', authenticate, requireRole('super_admin'), async (req, res) => {
  try {
    const result = await pool.syncAndBackupDatabase();
    await auditLog(req.user.id, 'super_admin', 'database_safety_backup_created', 'database', 'system', result, req.ip);
    res.json({
      success: true,
      message: 'Database snapshot and safety storage sync completed successfully',
      details: result
    });
  } catch (err) {
    console.error('[Admin] Safety backup error:', err.message);
    res.status(500).json({ error: 'Failed to perform safety backup' });
  }
});

// POST /api/admin/db/test-tidb — Test live TiDB connection
router.post('/db/test-tidb', authenticate, requireRole('super_admin'), async (req, res) => {
  const { host, port, user, password, database, ssl } = req.body;
  try {
    const customConfig = (host && user) ? {
      host,
      port: parseInt(port || 4000),
      user,
      password: password || '',
      database: database || 'visai2027',
      ssl: ssl ? { rejectUnauthorized: true } : undefined
    } : null;

    const result = await pool.testTiDbConnection(customConfig);
    res.json(result);
  } catch (err) {
    console.error('[Admin] Test TiDB error:', err.message);
    res.status(500).json({ error: 'Failed to test TiDB connection' });
  }
});

// =====================================================
// EMAIL BROADCAST & DISPATCH (Admin)
// =====================================================

const emailService = require('../services/emailService');

// POST /api/admin/send-email — Broadcast or send individual email
router.post('/send-email', authenticate, requireRole('super_admin', 'coordinator'), async (req, res) => {
  const { target_group, custom_email, custom_name, subject, body_html, body_text, sender_email } = req.body;

  if (!subject || (!body_html && !body_text)) {
    return res.status(400).json({ error: 'Subject and email body are required' });
  }

  try {
    const result = await emailService.broadcastEmail({
      targetGroup: target_group || 'everyone',
      customEmail: custom_email,
      customName: custom_name,
      subject,
      bodyHtml: body_html,
      bodyText: body_text || body_html,
      senderEmail: sender_email || 'vamsiinampudi01@gmail.com',
    });

    await auditLog(
      req.user.id,
      req.user.role,
      'email_broadcast_dispatched',
      'email',
      target_group || 'custom',
      { subject, total_dispatched: result.totalDispatched, sender: result.sender },
      req.ip
    );

    res.json(result);
  } catch (err) {
    console.error('[Admin] Send email error:', err.message);
    res.status(500).json({ error: 'Failed to dispatch email: ' + err.message });
  }
});

// GET /api/admin/email-logs — Get recent dispatched emails
router.get('/email-logs', authenticate, requireRole('super_admin', 'coordinator'), async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const logs = await emailService.getEmailLogs(limit);
    res.json({ logs });
  } catch (err) {
    console.error('[Admin] Get email logs error:', err.message);
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

// GET /api/admin/email-recipients-preview — Count and preview recipients
router.get('/email-recipients-preview', authenticate, requireRole('super_admin', 'coordinator'), async (req, res) => {
  try {
    const { target_group, custom_email, custom_name } = req.query;
    const recipients = await emailService.resolveRecipients(target_group, custom_email, custom_name);
    res.json({ count: recipients.length, recipients });
  } catch (err) {
    console.error('[Admin] Recipients preview error:', err.message);
    res.status(500).json({ error: 'Failed to preview recipients' });
  }
});

// POST /api/admin/upload-image — Upload local image from admin visual editor
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch(e) {}
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueName = `img-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, uniqueName);
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (PNG, JPG, WEBP, SVG, GIF) are allowed'));
    }
  }
});

router.post('/upload-image', authenticate, requireRole('super_admin'), imageUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
    });
  } catch (err) {
    console.error('[Admin] Image upload error:', err.message);
    res.status(500).json({ error: 'Failed to save uploaded image: ' + err.message });
  }
});

module.exports = router;
