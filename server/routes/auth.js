const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../database');
const { authenticate, auditLog } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'visai2027_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Pre-seeded fallback memory users for instant local / offline login
const FALLBACK_USERS = [
  {
    id: 'usr-admin-001',
    email: 'admin@visai.in',
    password: 'Admin@VISAI2027',
    role: 'super_admin',
    full_name: 'VISAI Super Admin',
    is_active: true,
    email_verified: true,
  },
  {
    id: 'usr-coord-002',
    email: 'coordinator@visai.in',
    password: 'Coordinator@VISAI2027',
    role: 'coordinator',
    full_name: 'Dr. P. Chandrasekhar (Convenor)',
    is_active: true,
    email_verified: true,
  },
  {
    id: 'usr-jury-003',
    email: 'jury@visai.in',
    password: 'Jury@VISAI2027',
    role: 'jury',
    full_name: 'Dr. Arvind Swaminathan (Jury Lead)',
    is_active: true,
    email_verified: true,
  },
  {
    id: 'usr-part-004',
    email: 'leader@visai.in',
    password: 'Leader@VISAI2027',
    role: 'participant',
    full_name: 'Rahul Sharma (Team Leader)',
    is_active: true,
    email_verified: true,
  },
];

// Additional in-memory registrations if DB is offline
const inMemoryUsers = [...FALLBACK_USERS];

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, full_name, phone } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ error: 'Email, password, and full name are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Try Database first
  try {
    const conn = await pool.getConnection();
    try {
      const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
      if (existing.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const userId = uuidv4();
      const profileId = uuidv4();
      const hash = await bcrypt.hash(password, 12);

      await conn.beginTransaction();
      await conn.query(
        'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [userId, normalizedEmail, hash, 'participant']
      );
      await conn.query(
        'INSERT INTO user_profiles (id, user_id, full_name, phone, email_verified) VALUES (?, ?, ?, ?, ?)',
        [profileId, userId, full_name, phone || null, true]
      );
      await conn.commit();

      const token = jwt.sign({ id: userId, role: 'participant', email: normalizedEmail, full_name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      return res.status(201).json({
        message: 'Account created successfully',
        token,
        user: { id: userId, email: normalizedEmail, role: 'participant', full_name }
      });
    } finally {
      conn.release();
    }
  } catch (dbErr) {
    console.warn('[Auth] Database unavailable for register, using local store:', dbErr.message);

    // Fallback store
    if (inMemoryUsers.some(u => u.email === normalizedEmail)) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const userId = uuidv4();
    const newUser = {
      id: userId,
      email: normalizedEmail,
      password: password,
      role: 'participant',
      full_name,
      phone,
      is_active: true,
      email_verified: true,
    };
    inMemoryUsers.push(newUser);

    const token = jwt.sign({ id: userId, role: 'participant', email: normalizedEmail, full_name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: userId, email: normalizedEmail, role: 'participant', full_name }
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // 1. Check built-in fallback / in-memory users first for instant match
  const fallbackUser = inMemoryUsers.find(u => u.email === normalizedEmail);
  if (fallbackUser && fallbackUser.password === password) {
    const token = jwt.sign(
      { id: fallbackUser.id, role: fallbackUser.role, email: fallbackUser.email, full_name: fallbackUser.full_name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return res.json({
      token,
      user: {
        id: fallbackUser.id,
        email: fallbackUser.email,
        role: fallbackUser.role,
        full_name: fallbackUser.full_name,
        email_verified: fallbackUser.email_verified
      }
    });
  }

  // 2. Try MySQL database
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.email, u.password_hash, u.role, u.is_active,
              p.full_name, p.email_verified
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.email = ?`,
      [normalizedEmail]
    );

    if (users.length > 0) {
      const user = users[0];
      if (!user.is_active) {
        return res.status(403).json({ error: 'Your account has been deactivated. Please contact VISAI support.' });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (match) {
        const token = jwt.sign(
          { id: user.id, role: user.role, email: user.email, full_name: user.full_name },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );
        return res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            full_name: user.full_name,
            email_verified: user.email_verified
          }
        });
      }
    }
  } catch (err) {
    console.warn('[Auth] Database query error on login:', err.message);
  }

  return res.status(401).json({ error: 'Invalid email or password' });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.role, u.is_active, u.created_at,
              p.full_name, p.phone, p.email_verified
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (rows.length > 0) {
      let team = null;
      if (rows[0].role === 'participant') {
        const [teams] = await pool.query(
          'SELECT id, team_name, status, payment_status, registration_number FROM teams WHERE leader_user_id = ?',
          [req.user.id]
        );
        if (teams.length > 0) team = teams[0];
      }
      return res.json({ user: rows[0], team });
    }
  } catch (err) {
    console.warn('[Auth] Database query failed on /me, returning decoded user info:', err.message);
  }

  // Fallback user from req.user
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email || 'user@visai.in',
      role: req.user.role || 'participant',
      full_name: req.user.full_name || 'VISAI User',
      email_verified: true,
      is_active: true
    },
    team: null
  });
});

module.exports = router;
