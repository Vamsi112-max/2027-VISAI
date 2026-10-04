const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'visai.db');
const db = new sqlite3.Database(DB_PATH);

// Helper to run sqlite query as promise
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Convert MySQL SQL syntax to SQLite syntax
function transformSql(sql) {
  let s = sql;
  s = s.replace(/DATETIME/gi, 'TEXT');
  s = s.replace(/TIMESTAMP/gi, 'TEXT');
  s = s.replace(/LONGTEXT/gi, 'TEXT');
  s = s.replace(/JSON/gi, 'TEXT');
  s = s.replace(/BOOLEAN/gi, 'INTEGER');
  s = s.replace(/ENUM\([^)]+\)/gi, 'TEXT');
  s = s.replace(/ON UPDATE CURRENT_TIMESTAMP/gi, '');
  s = s.replace(/NOW\(\)/gi, "datetime('now')");
  s = s.replace(/CURRENT_TIMESTAMP/gi, "datetime('now')");
  s = s.replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT');
  s = s.replace(/TRUE/gi, '1');
  s = s.replace(/FALSE/gi, '0');
  s = s.replace(/UUID\(\)/gi, `'${uuidv4()}'`);
  return s;
}

// Initialize SQLite schema and pre-seed real data
async function initializeSqliteDatabase() {
  console.log('[SQLite DB] Initializing local database file at:', DB_PATH);

  // Enable WAL mode & foreign keys
  await run('PRAGMA journal_mode = WAL;');
  await run('PRAGMA foreign_keys = OFF;'); // Temporarily disable during schema build

  // Check if users table has password_hash column, if not recreate
  try {
    const tableInfo = await all(`PRAGMA table_info(users);`);
    const hasPasswordHash = tableInfo.some(col => col.name === 'password_hash');
    if (tableInfo.length > 0 && !hasPasswordHash) {
      console.log('[SQLite DB] Upgrading legacy table schema...');
      await run(`DROP TABLE IF EXISTS users;`);
      await run(`DROP TABLE IF EXISTS user_profiles;`);
      await run(`DROP TABLE IF EXISTS teams;`);
      await run(`DROP TABLE IF EXISTS team_leader_details;`);
      await run(`DROP TABLE IF EXISTS college_details;`);
      await run(`DROP TABLE IF EXISTS problem_statements;`);
      await run(`DROP TABLE IF EXISTS jury_members;`);
      await run(`DROP TABLE IF EXISTS submissions;`);
      await run(`DROP TABLE IF EXISTS evaluations;`);
    }
  } catch (e) {}

  // Users
  await run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'participant',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // User Profiles
  await run(`CREATE TABLE IF NOT EXISTS user_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email_verified INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Events
  await run(`CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    edition TEXT NOT NULL,
    host_college TEXT,
    tagline TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Rounds
  await run(`CREATE TABLE IF NOT EXISTS rounds (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    round_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    submission_deadline TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Teams
  await run(`CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    registration_number TEXT UNIQUE,
    event_id TEXT,
    leader_user_id TEXT,
    team_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Team Leader Details
  await run(`CREATE TABLE IF NOT EXISTS team_leader_details (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college TEXT NOT NULL,
    department TEXT,
    course TEXT,
    year_of_study TEXT,
    student_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Team Members
  await run(`CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    member_order INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    college TEXT,
    department TEXT,
    student_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // College Details
  await run(`CREATE TABLE IF NOT EXISTS college_details (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL UNIQUE,
    college_name TEXT NOT NULL,
    department TEXT,
    city TEXT,
    district TEXT,
    state TEXT,
    pincode TEXT,
    address TEXT,
    accommodation_acknowledged INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Problem Statements
  await run(`CREATE TABLE IF NOT EXISTS problem_statements (
    id TEXT PRIMARY KEY,
    event_id TEXT,
    ps_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    track TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Team Problem Selections
  await run(`CREATE TABLE IF NOT EXISTS team_problem_selections (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    problem_statement_id TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    selected_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Submissions
  await run(`CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    round_id TEXT,
    ppt_url TEXT,
    github_url TEXT,
    figma_url TEXT,
    video_url TEXT,
    abstract_text TEXT,
    status TEXT NOT NULL DEFAULT 'submitted',
    submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Jury Members
  await run(`CREATE TABLE IF NOT EXISTS jury_members (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expertise TEXT,
    affiliation TEXT,
    initial_password TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Jury Assignments
  await run(`CREATE TABLE IF NOT EXISTS jury_assignments (
    id TEXT PRIMARY KEY,
    jury_member_id TEXT NOT NULL,
    team_id TEXT NOT NULL,
    round_id TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    assigned_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Evaluations
  await run(`CREATE TABLE IF NOT EXISTS evaluations (
    id TEXT PRIMARY KEY,
    jury_assignment_id TEXT,
    team_id TEXT NOT NULL,
    jury_member_id TEXT NOT NULL,
    round_id TEXT,
    total_score REAL DEFAULT 0,
    comments TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Payments
  await run(`CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    internal_order_id TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    payment_method TEXT DEFAULT 'razorpay',
    amount_paise INTEGER NOT NULL DEFAULT 100000,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'paid',
    is_verified INTEGER NOT NULL DEFAULT 1,
    invoice_number TEXT,
    invoice_approved INTEGER NOT NULL DEFAULT 0,
    invoice_approved_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Payment Events
  await run(`CREATE TABLE IF NOT EXISTS payment_events (
    id TEXT PRIMARY KEY,
    payment_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Event Settings
  await run(`CREATE TABLE IF NOT EXISTS event_settings (
    id TEXT PRIMARY KEY,
    event_id TEXT,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Evaluation Criteria
  await run(`CREATE TABLE IF NOT EXISTS evaluation_criteria (
    id TEXT PRIMARY KEY,
    round_id TEXT,
    criterion_name TEXT NOT NULL,
    max_score REAL DEFAULT 25,
    weight REAL DEFAULT 1,
    display_order INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Results
  await run(`CREATE TABLE IF NOT EXISTS results (
    id TEXT PRIMARY KEY,
    round_id TEXT,
    team_id TEXT NOT NULL,
    final_score REAL DEFAULT 0,
    rank INTEGER,
    published_status TEXT DEFAULT 'pending',
    is_published INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Safe schema migrations for existing databases
  try { await run('ALTER TABLE problem_statements ADD COLUMN max_capacity INTEGER DEFAULT 25'); } catch(e){}
  try { await run('ALTER TABLE problem_statements ADD COLUMN round_id TEXT'); } catch(e){}
  try { await run('ALTER TABLE teams ADD COLUMN is_locked INTEGER DEFAULT 0'); } catch(e){}
  try { await run('ALTER TABLE payments ADD COLUMN internal_order_id TEXT'); } catch(e){}
  try { await run('ALTER TABLE payments ADD COLUMN razorpay_order_id TEXT'); } catch(e){}
  try { await run('ALTER TABLE payments ADD COLUMN razorpay_payment_id TEXT'); } catch(e){}
  try { await run('ALTER TABLE payments ADD COLUMN payment_method TEXT DEFAULT "razorpay"'); } catch(e){}
  try { await run('ALTER TABLE payments ADD COLUMN is_verified INTEGER DEFAULT 1'); } catch(e){}
  try { await run('ALTER TABLE payments ADD COLUMN invoice_number TEXT'); } catch(e){}
  try { await run('ALTER TABLE payments ADD COLUMN invoice_approved INTEGER DEFAULT 0'); } catch(e){}
  try { await run('ALTER TABLE payments ADD COLUMN invoice_approved_at TEXT'); } catch(e){}
  try { await run('ALTER TABLE team_leader_details ADD COLUMN verification_code TEXT'); } catch(e){}
  try { await run('ALTER TABLE team_leader_details ADD COLUMN email_verified INTEGER DEFAULT 1'); } catch(e){}
  try { await run("INSERT OR IGNORE INTO event_settings (id, event_id, setting_key, setting_value) VALUES ('set-01', 'ev-2027', 'registration_fee_paise', '100000')"); } catch(e){}

  // Audit Logs
  await run(`CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    actor_user_id TEXT,
    user_role TEXT,
    actor_role TEXT,
    action TEXT NOT NULL,
    entity_type TEXT,
    resource_type TEXT,
    entity_id TEXT,
    resource_id TEXT,
    ip_address TEXT,
    details TEXT,
    metadata TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Safe schema migrations for audit_logs
  try { await run('ALTER TABLE audit_logs ADD COLUMN user_id TEXT'); } catch(e){}
  try { await run('ALTER TABLE audit_logs ADD COLUMN actor_user_id TEXT'); } catch(e){}
  try { await run('ALTER TABLE audit_logs ADD COLUMN user_role TEXT'); } catch(e){}
  try { await run('ALTER TABLE audit_logs ADD COLUMN actor_role TEXT'); } catch(e){}
  try { await run('ALTER TABLE audit_logs ADD COLUMN entity_type TEXT'); } catch(e){}
  try { await run('ALTER TABLE audit_logs ADD COLUMN resource_type TEXT'); } catch(e){}
  try { await run('ALTER TABLE audit_logs ADD COLUMN entity_id TEXT'); } catch(e){}
  try { await run('ALTER TABLE audit_logs ADD COLUMN resource_id TEXT'); } catch(e){}
  try { await run('ALTER TABLE audit_logs ADD COLUMN metadata TEXT'); } catch(e){}

  // Seed Admin & Default Users
  const adminHash = await bcrypt.hash('admin123', 10);
  const juryHash = await bcrypt.hash('jury123', 10);
  const leaderHash = await bcrypt.hash('visai2027', 10);

  // Insert Super Admin
  await run(`INSERT OR IGNORE INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
    ['usr-admin-01', 'admin@visai.in', adminHash, 'super_admin']);
  await run(`INSERT OR IGNORE INTO user_profiles (id, user_id, full_name, phone) VALUES (?, ?, ?, ?)`,
    ['prof-admin-01', 'usr-admin-01', 'Prof. Dr. P. Chandrakumar (Super Admin)', '+91 1800 212 7669']);

  // Insert Jury Member
  await run(`INSERT OR IGNORE INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
    ['usr-jury-01', 'jury.ai@visai.in', juryHash, 'jury']);
  await run(`INSERT OR IGNORE INTO user_profiles (id, user_id, full_name, phone) VALUES (?, ?, ?, ?)`,
    ['prof-jury-01', 'usr-jury-01', 'Dr. Arvind Swaminathan (Jury Lead)', '+91 98765 11223']);
  await run(`INSERT OR IGNORE INTO jury_members (id, user_id, expertise, affiliation, initial_password) VALUES (?, ?, ?, ?, ?)`,
    ['jm-01', 'usr-jury-01', 'SDG 09: Industry & AI', 'Microsoft Cloud & AI', 'Jury@VISAI2027']);

  // Insert Participant Team Lead
  await run(`INSERT OR IGNORE INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
    ['usr-lead-01', 'leader@visai.in', leaderHash, 'participant']);
  await run(`INSERT OR IGNORE INTO user_profiles (id, user_id, full_name, phone) VALUES (?, ?, ?, ?)`,
    ['prof-lead-01', 'usr-lead-01', 'Aditya Verma (Team Lead)', '+91 98765 43210']);

  // Seed Event
  await run(`INSERT OR IGNORE INTO events (id, name, edition, host_college, tagline) VALUES (?, ?, ?, ?, ?)`,
    ['ev-2027', 'VISAI 2027', '17th Edition', 'Vel Tech R&D Institute of Science and Technology', 'Innovate. Build. Transform.']);

  // Seed 8 UN SDG Problem Statements
  const SEED_PS = [
    ['ps-sdg07-1', 'VISAI-SDG07-IND01', 'Solar Microgrid Dynamic Load Balancing & Battery Telemetry', 'SDG 07: Affordable & Clean Energy', 'NICOLA FOUNDATION'],
    ['ps-sdg06-1', 'VISAI-SDG06-IND01', 'Smart Acoustic Leak Detection & Purity Sensor Mesh', 'SDG 06: Clean Water & Sanitation', 'IEEE PSES'],
    ['ps-sdg11-1', 'VISAI-SDG11-IND01', 'Vision-Based Adaptive Traffic Signal Optimization & Emergency Corridors', 'SDG 11: Sustainable Cities', 'CREDAI CHENNAI'],
    ['ps-sdg09-1', 'VISAI-SDG09-IND01', 'Predictive Vibration Anomaly Detection in Industrial High-Speed Drives', 'SDG 09: Industry, Innovation & Infrastructure', 'TURBO ENERGY (TEL)'],
    ['ps-sdg13-1', 'VISAI-SDG13-IND01', 'Hyperlocal Greenhouse Gas Telemetry & Carbon Offset Verification', 'SDG 13: Climate Action', 'VIRUKSA'],
    ['ps-sdg14-1', 'VISAI-SDG14-IND01', 'Autonomous Surface Skimmer for Ocean Microplastics & Marine Health', 'SDG 14: Life Below Water', 'AMREP'],
    ['ps-sdg12-1', 'VISAI-SDG12-IND01', 'Automated E-Waste Disassembly & Rare Earth Component Sorter', 'SDG 12: Responsible Consumption', 'CBS Technologies'],
    ['ps-sdg15-1', 'VISAI-SDG15-IND01', 'Multispectral Drone Crop Health Telemetry & Soil Nitrogen Sensing', 'SDG 15: Life on Land', 'Vel Tech TBI'],
  ];

  for (const [id, code, title, track, partner] of SEED_PS) {
    await run(`INSERT OR IGNORE INTO problem_statements (id, event_id, ps_code, title, track, category, short_description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, 'ev-2027', code, title, track, partner, `Official industrial challenge statement supported by ${partner}`]);
  }

  // Seed Sample Team
  await run(`INSERT OR IGNORE INTO teams (id, registration_number, event_id, leader_user_id, team_name, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['tm-8492', 'VISAI27-TM-8492', 'ev-2027', 'usr-lead-01', 'Team Innovate_X', 'shortlisted', 'paid']);
  await run(`INSERT OR IGNORE INTO team_leader_details (id, team_id, full_name, email, phone, college, department, year_of_study, student_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['tld-01', 'tm-8492', 'Aditya Verma', 'leader@visai.in', '+91 98765 43210', 'IIT Bombay', 'Computer Science & Engineering', '3rd Year B.Tech', 'IITB-2024-CS104']);
  await run(`INSERT OR IGNORE INTO college_details (id, team_id, college_name, department, city, state, pincode, address, accommodation_acknowledged) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['cd-01', 'tm-8492', 'Indian Institute of Technology Bombay', 'Computer Science', 'Mumbai', 'Maharashtra', '400076', 'Powai, Mumbai', 1]);
  await run(`INSERT OR IGNORE INTO team_problem_selections (id, team_id, problem_statement_id) VALUES (?, ?, ?)`,
    ['tps-01', 'tm-8492', 'ps-sdg09-1']);

  console.log('[SQLite DB] Successfully created and pre-seeded local database tables in server/visai.db!');
}

// MySQL-Compatible Wrapper for SQLite
const sqlitePool = {
  async query(sql, params = []) {
    const tSql = transformSql(sql);
    const trimmed = tSql.trim().toUpperCase();

    if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA')) {
      const rows = await all(tSql, params);
      return [rows, []];
    } else {
      const result = await run(tSql, params);
      return [{ insertId: result.lastID, affectedRows: result.changes }, []];
    }
  },

  async getConnection() {
    return {
      query: (sql, params) => sqlitePool.query(sql, params),
      beginTransaction: async () => { await run('BEGIN TRANSACTION'); },
      commit: async () => { await run('COMMIT'); },
      rollback: async () => { await run('ROLLBACK'); },
      release: () => {},
    };
  }
};

module.exports = {
  db,
  sqlitePool,
  initializeSqliteDatabase
};
