const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pool = require('../database');
const { authenticate, requireRole, auditLog } = require('../middleware/auth');

const router = express.Router();

// File storage configuration
const UPLOAD_DIR = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
const MAX_SIZE_MB = parseInt(process.env.UPLOAD_MAX_SIZE_MB || '25');

const ALLOWED_MIME_TYPES = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/pdf',
];
const ALLOWED_EXTENSIONS = ['.ppt', '.pptx', '.pdf'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${uuidv4()}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext) && ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`));
    }
  },
});

// Detect file_type from extension
function detectFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (['.ppt', '.pptx'].includes(ext)) return 'ppt';
  return 'other';
}

// =====================================================
// PARTICIPANT: SUBMIT
// =====================================================

// POST /api/submissions — Create/update submission + upload files
router.post('/', authenticate, requireRole('participant'), upload.single('file'), async (req, res) => {
  const { abstract_text, github_url, demo_url, video_url } = req.body;

  const conn = await pool.getConnection();
  try {
    // Must have paid team with problem selected
    const [teams] = await conn.query(
      "SELECT id FROM teams WHERE leader_user_id = ? AND payment_status = 'paid'",
      [req.user.id]
    );
    if (teams.length === 0) {
      return res.status(403).json({ error: 'You must complete payment to submit' });
    }
    const teamId = teams[0].id;

    // Get active round
    const [rounds] = await conn.query(
      "SELECT id FROM rounds WHERE status = 'open' ORDER BY round_number ASC LIMIT 1"
    );
    if (rounds.length === 0) {
      return res.status(400).json({ error: 'No active submission round' });
    }
    const roundId = rounds[0].id;

    // Get selected problem
    const [selections] = await conn.query(
      'SELECT problem_statement_id FROM team_problem_selections WHERE team_id = ? AND round_id = ? AND is_active = TRUE',
      [teamId, roundId]
    );
    if (selections.length === 0) {
      return res.status(400).json({ error: 'Please select a problem statement before submitting' });
    }
    const problemId = selections[0].problem_statement_id;

    await conn.beginTransaction();

    // Upsert submission
    const [existingSubs] = await conn.query(
      'SELECT id, version FROM submissions WHERE team_id = ? AND round_id = ?',
      [teamId, roundId]
    );

    let submissionId;
    let newVersion = 1;

    if (existingSubs.length > 0) {
      submissionId = existingSubs[0].id;
      newVersion = existingSubs[0].version + 1;
      await conn.query(
        `UPDATE submissions SET abstract_text=?, github_url=?, demo_url=?, video_url=?,
          status='submitted', submitted_at=NOW(), version=?, updated_at=NOW()
         WHERE id=?`,
        [abstract_text || null, github_url || null, demo_url || null, video_url || null, newVersion, submissionId]
      );
    } else {
      submissionId = uuidv4();
      await conn.query(
        `INSERT INTO submissions (id, team_id, round_id, problem_statement_id, abstract_text, github_url, demo_url, video_url, status, submitted_at, version)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'submitted', NOW(), 1)`,
        [submissionId, teamId, roundId, problemId, abstract_text || null, github_url || null, demo_url || null, video_url || null]
      );
    }

    // Handle file upload (if present)
    if (req.file) {
      // Mark old files as not current
      await conn.query('UPDATE submission_files SET is_current = FALSE WHERE submission_id = ?', [submissionId]);

      const fileType = detectFileType(req.file.originalname);
      await conn.query(
        `INSERT INTO submission_files (id, submission_id, file_type, original_name, stored_name, mime_type, file_size, storage_path, version, is_current)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [uuidv4(), submissionId, fileType, req.file.originalname, req.file.filename, req.file.mimetype, req.file.size, req.file.path, newVersion]
      );
    }

    await conn.commit();

    await auditLog(req.user.id, 'participant', 'submission_created', 'submissions', submissionId, { version: newVersion }, req.ip);

    res.json({
      success: true,
      message: 'Submission saved successfully',
      submission_id: submissionId,
      version: newVersion,
    });
  } catch (err) {
    await conn.rollback();
    console.error('[Submission] Create error:', err.message);
    if (err.message.includes('Invalid file')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to save submission' });
  } finally {
    conn.release();
  }
});

// GET /api/submissions/my — Get own submissions
router.get('/my', authenticate, requireRole('participant'), async (req, res) => {
  try {
    const [teams] = await pool.query('SELECT id FROM teams WHERE leader_user_id = ?', [req.user.id]);
    if (teams.length === 0) return res.json({ submissions: [] });

    const [submissions] = await pool.query(
      `SELECT s.*, r.name as round_name, r.round_number,
              ps.title as problem_title, ps.ps_code
       FROM submissions s
       JOIN rounds r ON r.id = s.round_id
       LEFT JOIN problem_statements ps ON ps.id = s.problem_statement_id
       WHERE s.team_id = ?
       ORDER BY s.created_at DESC`,
      [teams[0].id]
    );

    for (const sub of submissions) {
      const [files] = await pool.query(
        'SELECT id, file_type, original_name, file_size, uploaded_at, version, is_current FROM submission_files WHERE submission_id = ? ORDER BY uploaded_at DESC',
        [sub.id]
      );
      sub.files = files;
    }

    res.json({ submissions });
  } catch (err) {
    console.error('[Submission] Get my error:', err.message);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// =====================================================
// ADMIN / JURY ROUTES
// =====================================================

// GET /api/submissions — Admin: all submissions
router.get('/', authenticate, requireRole('super_admin', 'coordinator'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, round_id } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = 'WHERE 1=1';
    const params = [];

    if (status) { where += ' AND s.status = ?'; params.push(status); }
    if (round_id) { where += ' AND s.round_id = ?'; params.push(round_id); }

    const [submissions] = await pool.query(
      `SELECT s.*, t.team_name, t.registration_number, r.name as round_name, ps.title as problem_title
       FROM submissions s
       JOIN teams t ON t.id = s.team_id
       JOIN rounds r ON r.id = s.round_id
       LEFT JOIN problem_statements ps ON ps.id = s.problem_statement_id
       ${where}
       ORDER BY s.submitted_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ submissions });
  } catch (err) {
    console.error('[Submission] Admin list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// GET /api/submissions/:id — Get single submission (admin/jury)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const [subs] = await pool.query(
      `SELECT s.*, t.team_name, r.name as round_name, ps.title as problem_title, ps.full_description
       FROM submissions s
       JOIN teams t ON t.id = s.team_id
       JOIN rounds r ON r.id = s.round_id
       LEFT JOIN problem_statements ps ON ps.id = s.problem_statement_id
       WHERE s.id = ?`,
      [req.params.id]
    );

    if (subs.length === 0) return res.status(404).json({ error: 'Submission not found' });

    // Jury can only access assigned teams
    if (req.user.role === 'jury') {
      const [assignments] = await pool.query(
        `SELECT ja.id FROM jury_assignments ja
         JOIN jury_members jm ON jm.id = ja.jury_member_id
         WHERE jm.user_id = ? AND ja.team_id = ? AND ja.is_active = TRUE`,
        [req.user.id, subs[0].team_id]
      );
      if (assignments.length === 0) {
        return res.status(403).json({ error: 'You are not assigned to this team' });
      }
    }

    const [files] = await pool.query(
      'SELECT * FROM submission_files WHERE submission_id = ? ORDER BY uploaded_at DESC',
      [req.params.id]
    );
    subs[0].files = files;

    res.json({ submission: subs[0] });
  } catch (err) {
    console.error('[Submission] Get error:', err.message);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

module.exports = router;
