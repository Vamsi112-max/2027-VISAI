const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'visai.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run('PRAGMA foreign_keys = ON');
    createTables();
  }
});

function createTables() {
  db.serialize(() => {
    // Roles & Users
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'participant' CHECK(role IN ('participant', 'jury', 'admin', 'coordinator')),
      is_verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Teams
    db.run(`CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      leader_id INTEGER,
      problem_statement_id INTEGER,
      status TEXT DEFAULT 'Draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (leader_id) REFERENCES users(id),
      FOREIGN KEY (problem_statement_id) REFERENCES problem_statements(id)
    )`);

    // Team Members
    db.run(`CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      institution TEXT,
      FOREIGN KEY (team_id) REFERENCES teams(id)
    )`);

    // Problem Statements
    db.run(`CREATE TABLE IF NOT EXISTS problem_statements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      description TEXT,
      status TEXT DEFAULT 'active'
    )`);

    // Submissions
    db.run(`CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER,
      version INTEGER NOT NULL,
      abstract TEXT,
      ppt_url TEXT,
      status TEXT DEFAULT 'Submitted',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (team_id) REFERENCES teams(id)
    )`);

    // Evaluations
    db.run(`CREATE TABLE IF NOT EXISTS evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER,
      jury_id INTEGER,
      total_score INTEGER,
      comments TEXT,
      decision TEXT,
      status TEXT DEFAULT 'Draft',
      FOREIGN KEY (submission_id) REFERENCES submissions(id),
      FOREIGN KEY (jury_id) REFERENCES users(id)
    )`);

    // Payments
    db.run(`CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER,
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      amount INTEGER,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (team_id) REFERENCES teams(id)
    )`);
  });
}

module.exports = db;
