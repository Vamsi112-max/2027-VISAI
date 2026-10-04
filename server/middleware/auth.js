const jwt = require('jsonwebtoken');
const pool = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'visai2027_jwt_secret';

/**
 * Verify JWT and attach user to request
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Try database validation
    try {
      const [rows] = await pool.query(
        'SELECT id, email, role, is_active FROM users WHERE id = ?',
        [decoded.id]
      );

      if (rows.length > 0) {
        if (!rows[0].is_active) {
          return res.status(401).json({ error: 'User account not found or deactivated' });
        }
        req.user = rows[0];
        return next();
      }
    } catch (dbErr) {
      // Database offline — accept valid signed JWT
      console.warn('[Auth Middleware] DB offline, using decoded JWT payload:', dbErr.message);
    }

    // Attach decoded user
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      full_name: decoded.full_name,
      is_active: true
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Role-based authorization middleware factory
 * Usage: requireRole('super_admin', 'coordinator')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }
    next();
  };
}

/**
 * Log audit trail
 */
async function auditLog(userId, userRole, action, entityType, entityId, details = {}, ipAddress = null) {
  try {
    const { v4: uuidv4 } = require('uuid');
    await pool.query(
      `INSERT INTO audit_logs (id, user_id, user_role, action, entity_type, entity_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        userId || null,
        userRole || 'anonymous',
        action,
        entityType || null,
        entityId || null,
        JSON.stringify(details),
        ipAddress || null,
      ]
    );
  } catch (err) {
    console.error('[AuditLog] Failed to write log:', err.message);
  }
}

module.exports = { authenticate, requireRole, auditLog };
