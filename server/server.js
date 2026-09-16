require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'visai_development_secret';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Dummy OTP Storage (In-memory for development)
const otpStore = new Map();

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/request-otp', (req, res) => {
  const { email } = req.body;
  const otp = '123456'; // Dummy OTP for development
  otpStore.set(email, otp);
  
  console.log(`[DEVELOPMENT OTP] Sent to ${email}: ${otp}`);
  res.json({ message: 'OTP sent successfully (Check server logs)' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password, otp } = req.body;
  
  if (otpStore.get(email) !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Hashing error' });

    db.run(
      'INSERT INTO users (name, email, phone, password, is_verified) VALUES (?, ?, ?, ?, 1)',
      [name, email, phone, hash],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already registered' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        
        otpStore.delete(email); // Clean up OTP
        res.status(201).json({ message: 'Registration successful', userId: this.lastID });
      }
    );
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'User not found' });

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ error: 'Comparison error' });
      if (!match) return res.status(400).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, role: user.role, name: user.name });
    });
  });
});

// ==========================================
// API ROUTES: TEAMS & PARTICIPANTS
// ==========================================

app.post('/api/teams', authenticateToken, (req, res) => {
  const { name, problem_statement_id, members } = req.body;
  const leader_id = req.user.id;
  
  db.run(
    'INSERT INTO teams (name, leader_id, problem_statement_id) VALUES (?, ?, ?)',
    [name, leader_id, problem_statement_id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create team' });
      
      const teamId = this.lastID;
      
      // Add members (simplified)
      if (members && members.length > 0) {
        const stmt = db.prepare('INSERT INTO team_members (team_id, name, email, phone, institution) VALUES (?, ?, ?, ?, ?)');
        members.forEach(m => {
          stmt.run(teamId, m.name, m.email, m.phone, m.institution);
        });
        stmt.finalize();
      }
      
      res.status(201).json({ message: 'Team created successfully', teamId });
    }
  );
});

app.get('/api/problem-statements', (req, res) => {
  db.all('SELECT * FROM problem_statements WHERE status = "active"', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`VISAI Backend Server running on port ${PORT}`);
});
