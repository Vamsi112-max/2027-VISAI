const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Raw body for Razorpay webhook (must come before express.json)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (with basic access — consider securing in production)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================================================
// DATABASE INITIALIZATION
// =====================================================

const pool = require('./database');
const { initializeDatabase } = require('./schema');

(async () => {
  if (!pool.isSqlite()) {
    try {
      await initializeDatabase();
    } catch (err) {
      console.error('[Server] TiDB schema init note:', err.message);
    }
  }
})();

// =====================================================
// ROUTES
// =====================================================

app.use('/api/auth', require('./routes/auth'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/problem-statements', require('./routes/problems'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/jury', require('./routes/jury'));
app.use('/api/results', require('./routes/results'));
app.use('/api/admin', require('./routes/admin'));

// Public endpoint for live site content (used by visitors and participants)
app.get('/api/content', async (req, res) => {
  try {
    const [settings] = await pool.query(
      `SELECT setting_value FROM event_settings WHERE setting_key = 'site_content_json' LIMIT 1`
    );
    if (settings && settings[0] && settings[0].setting_value) {
      try {
        return res.json({ content: JSON.parse(settings[0].setting_value) });
      } catch(err) {
        return res.json({ content: settings[0].setting_value });
      }
    }
    res.json({ content: null });
  } catch (e) {
    res.json({ content: null });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VISAI 2027 API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// ERROR HANDLING
// =====================================================

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server] Unhandled error:', err.message);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: `File too large. Maximum size is ${process.env.UPLOAD_MAX_SIZE_MB || 25}MB` });
  }

  res.status(500).json({ error: 'Internal server error' });
});

// =====================================================
// START
// =====================================================

app.listen(PORT, () => {
  console.log(`[Server] VISAI 2027 API running on port ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Server] Razorpay Mode: ${process.env.RAZORPAY_MODE || 'test'}`);
});
