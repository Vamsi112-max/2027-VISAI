require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('./database');

// =====================================================
// VISAI 2027 — Database Schema for TiDB/MySQL
// =====================================================

async function initializeDatabase() {
  const conn = await pool.getConnection();
  try {
    console.log('[Schema] Initializing VISAI 2027 database...');

    // Users
    await conn.query(`CREATE TABLE IF NOT EXISTS users (
      id            VARCHAR(36) PRIMARY KEY,
      email         VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role          ENUM('participant','jury','coordinator','super_admin') NOT NULL DEFAULT 'participant',
      is_active     BOOLEAN NOT NULL DEFAULT TRUE,
      created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS user_profiles (
      id                   VARCHAR(36) PRIMARY KEY,
      user_id              VARCHAR(36) NOT NULL UNIQUE,
      full_name            VARCHAR(255) NOT NULL,
      phone                VARCHAR(20),
      email_verified       BOOLEAN NOT NULL DEFAULT FALSE,
      email_verify_token   VARCHAR(255),
      email_verify_expires DATETIME,
      created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Events
    await conn.query(`CREATE TABLE IF NOT EXISTS events (
      id           VARCHAR(36) PRIMARY KEY,
      name         VARCHAR(255) NOT NULL,
      edition      VARCHAR(50) NOT NULL,
      host_college VARCHAR(255),
      tagline      TEXT,
      is_active    BOOLEAN NOT NULL DEFAULT TRUE,
      created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS event_settings (
      id            VARCHAR(36) PRIMARY KEY,
      event_id      VARCHAR(36) NOT NULL,
      setting_key   VARCHAR(100) NOT NULL,
      setting_value TEXT,
      setting_type  ENUM('string','number','boolean','json') DEFAULT 'string',
      updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_event_setting (event_id, setting_key),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS rounds (
      id                  VARCHAR(36) PRIMARY KEY,
      event_id            VARCHAR(36) NOT NULL,
      round_number        INT NOT NULL,
      name                VARCHAR(100) NOT NULL,
      description         TEXT,
      starts_at           DATETIME,
      ends_at             DATETIME,
      submission_deadline DATETIME,
      status              ENUM('upcoming','open','closed','completed') NOT NULL DEFAULT 'upcoming',
      created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_event_round (event_id, round_number),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )`);

    // Teams
    await conn.query(`CREATE TABLE IF NOT EXISTS teams (
      id                  VARCHAR(36) PRIMARY KEY,
      registration_number VARCHAR(20) UNIQUE,
      event_id            VARCHAR(36) NOT NULL,
      leader_user_id      VARCHAR(36) NOT NULL UNIQUE,
      team_name           VARCHAR(255) NOT NULL,
      status              ENUM('draft','registered','paid','active','disqualified') NOT NULL DEFAULT 'draft',
      payment_status      ENUM('pending','order_created','payment_attempted','paid','failed','cancelled','refunded') NOT NULL DEFAULT 'pending',
      created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (leader_user_id) REFERENCES users(id)
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS team_leader_details (
      id            VARCHAR(36) PRIMARY KEY,
      team_id       VARCHAR(36) NOT NULL UNIQUE,
      full_name     VARCHAR(255) NOT NULL,
      email         VARCHAR(255) NOT NULL,
      phone         VARCHAR(20) NOT NULL,
      college       VARCHAR(255) NOT NULL,
      department    VARCHAR(255),
      course        VARCHAR(255),
      year_of_study VARCHAR(50),
      student_id    VARCHAR(100),
      college_id    VARCHAR(100),
      created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS team_members (
      id            VARCHAR(36) PRIMARY KEY,
      team_id       VARCHAR(36) NOT NULL,
      member_order  INT NOT NULL,
      full_name     VARCHAR(255) NOT NULL,
      email         VARCHAR(255) NOT NULL,
      phone         VARCHAR(20),
      college       VARCHAR(255),
      department    VARCHAR(255),
      course        VARCHAR(255),
      year_of_study VARCHAR(50),
      student_id    VARCHAR(100),
      college_id    VARCHAR(100),
      created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_team_member_order (team_id, member_order),
      FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS college_details (
      id                         VARCHAR(36) PRIMARY KEY,
      team_id                    VARCHAR(36) NOT NULL UNIQUE,
      college_name               VARCHAR(255) NOT NULL,
      department                 VARCHAR(255),
      course                     VARCHAR(255),
      academic_year              VARCHAR(50),
      city                       VARCHAR(100),
      district                   VARCHAR(100),
      state                      VARCHAR(100),
      pincode                    VARCHAR(10),
      address                    TEXT,
      college_email              VARCHAR(255),
      college_phone              VARCHAR(20),
      college_website            VARCHAR(255),
      accommodation_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
      travel_mode                VARCHAR(100),
      arrival_date               DATE,
      departure_date             DATE,
      special_requirements       TEXT,
      created_at                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
    )`);

    // Payments
    await conn.query(`CREATE TABLE IF NOT EXISTS payments (
      id                  VARCHAR(36) PRIMARY KEY,
      team_id             VARCHAR(36) NOT NULL,
      internal_order_id   VARCHAR(100) UNIQUE,
      razorpay_order_id   VARCHAR(100),
      razorpay_payment_id VARCHAR(100),
      razorpay_signature  VARCHAR(500),
      amount_paise        INT NOT NULL,
      currency            VARCHAR(10) NOT NULL DEFAULT 'INR',
      status              ENUM('pending','order_created','payment_attempted','paid','failed','cancelled','refund_pending','refunded') NOT NULL DEFAULT 'pending',
      payment_method      VARCHAR(100),
      is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
      invoice_number      VARCHAR(100),
      invoice_approved    BOOLEAN NOT NULL DEFAULT FALSE,
      invoice_approved_at DATETIME,
      webhook_processed   BOOLEAN NOT NULL DEFAULT FALSE,
      failure_reason      TEXT,
      created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (team_id) REFERENCES teams(id)
    )`);

    // Safe TiDB migrations
    try { await conn.query('ALTER TABLE teams ADD COLUMN is_locked BOOLEAN DEFAULT FALSE'); } catch(e){}
    try { await conn.query('ALTER TABLE payments ADD COLUMN invoice_number VARCHAR(100)'); } catch(e){}
    try { await conn.query('ALTER TABLE payments ADD COLUMN invoice_approved BOOLEAN DEFAULT FALSE'); } catch(e){}
    try { await conn.query('ALTER TABLE payments ADD COLUMN invoice_approved_at DATETIME'); } catch(e){}
    try { await conn.query('ALTER TABLE team_leader_details ADD COLUMN verification_code VARCHAR(50)'); } catch(e){}
    try { await conn.query('ALTER TABLE team_leader_details ADD COLUMN email_verified BOOLEAN DEFAULT TRUE'); } catch(e){}

    await conn.query(`CREATE TABLE IF NOT EXISTS payment_events (
      id         VARCHAR(36) PRIMARY KEY,
      payment_id VARCHAR(36) NOT NULL,
      event_type VARCHAR(100) NOT NULL,
      payload    JSON,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (payment_id) REFERENCES payments(id)
    )`);

    // Problem Statements
    await conn.query(`CREATE TABLE IF NOT EXISTS problem_statements (
      id                  VARCHAR(36) PRIMARY KEY,
      event_id            VARCHAR(36) NOT NULL,
      round_id            VARCHAR(36),
      ps_code             VARCHAR(50) UNIQUE NOT NULL,
      title               VARCHAR(500) NOT NULL,
      short_description   TEXT,
      full_description    LONGTEXT,
      track               VARCHAR(100),
      category            VARCHAR(100),
      max_capacity        INT NOT NULL DEFAULT 25,
      status              ENUM('draft','published','closed','archived') NOT NULL DEFAULT 'draft',
      selection_starts_at DATETIME,
      selection_ends_at   DATETIME,
      instructions        TEXT,
      reference_material  TEXT,
      created_by          VARCHAR(36),
      created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (round_id) REFERENCES rounds(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS team_problem_selections (
      id                   VARCHAR(36) PRIMARY KEY,
      team_id              VARCHAR(36) NOT NULL,
      problem_statement_id VARCHAR(36) NOT NULL,
      round_id             VARCHAR(36) NOT NULL,
      selected_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      is_active            BOOLEAN NOT NULL DEFAULT TRUE,
      deselected_at        DATETIME,
      FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (problem_statement_id) REFERENCES problem_statements(id),
      FOREIGN KEY (round_id) REFERENCES rounds(id)
    )`);

    // Submissions
    await conn.query(`CREATE TABLE IF NOT EXISTS submissions (
      id                   VARCHAR(36) PRIMARY KEY,
      team_id              VARCHAR(36) NOT NULL,
      round_id             VARCHAR(36) NOT NULL,
      problem_statement_id VARCHAR(36),
      abstract_text        LONGTEXT,
      github_url           VARCHAR(500),
      demo_url             VARCHAR(500),
      video_url            VARCHAR(500),
      status               ENUM('draft','submitted','under_review','accepted','rejected') NOT NULL DEFAULT 'draft',
      submitted_at         DATETIME,
      version              INT NOT NULL DEFAULT 1,
      created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_team_round (team_id, round_id),
      FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (round_id) REFERENCES rounds(id),
      FOREIGN KEY (problem_statement_id) REFERENCES problem_statements(id)
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS submission_files (
      id            VARCHAR(36) PRIMARY KEY,
      submission_id VARCHAR(36) NOT NULL,
      file_type     ENUM('ppt','pdf','image','document','other') NOT NULL,
      original_name VARCHAR(500) NOT NULL,
      stored_name   VARCHAR(500) NOT NULL,
      mime_type     VARCHAR(100),
      file_size     INT,
      storage_path  VARCHAR(500),
      version       INT NOT NULL DEFAULT 1,
      is_current    BOOLEAN NOT NULL DEFAULT TRUE,
      uploaded_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
    )`);

    // Jury
    await conn.query(`CREATE TABLE IF NOT EXISTS jury_members (
      id          VARCHAR(36) PRIMARY KEY,
      user_id     VARCHAR(36) NOT NULL UNIQUE,
      expertise   TEXT,
      affiliation VARCHAR(255),
      is_active   BOOLEAN NOT NULL DEFAULT TRUE,
      created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS jury_assignments (
      id              VARCHAR(36) PRIMARY KEY,
      jury_member_id  VARCHAR(36) NOT NULL,
      team_id         VARCHAR(36) NOT NULL,
      round_id        VARCHAR(36) NOT NULL,
      assigned_by     VARCHAR(36),
      assigned_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      conflict_flagged BOOLEAN NOT NULL DEFAULT FALSE,
      conflict_reason  TEXT,
      is_active       BOOLEAN NOT NULL DEFAULT TRUE,
      UNIQUE KEY uq_jury_team_round (jury_member_id, team_id, round_id),
      FOREIGN KEY (jury_member_id) REFERENCES jury_members(id),
      FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (round_id) REFERENCES rounds(id),
      FOREIGN KEY (assigned_by) REFERENCES users(id)
    )`);

    // Evaluation
    await conn.query(`CREATE TABLE IF NOT EXISTS evaluation_criteria (
      id            VARCHAR(36) PRIMARY KEY,
      event_id      VARCHAR(36) NOT NULL,
      round_id      VARCHAR(36),
      name          VARCHAR(255) NOT NULL,
      description   TEXT,
      max_score     INT NOT NULL DEFAULT 20,
      weight        DECIMAL(5,2) NOT NULL DEFAULT 1.0,
      display_order INT NOT NULL DEFAULT 0,
      is_active     BOOLEAN NOT NULL DEFAULT TRUE,
      created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (round_id) REFERENCES rounds(id)
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS evaluations (
      id                VARCHAR(36) PRIMARY KEY,
      jury_assignment_id VARCHAR(36) NOT NULL UNIQUE,
      team_id           VARCHAR(36) NOT NULL,
      jury_member_id    VARCHAR(36) NOT NULL,
      round_id          VARCHAR(36) NOT NULL,
      total_score       DECIMAL(8,2),
      comments          TEXT,
      status            ENUM('pending','in_progress','submitted','locked') NOT NULL DEFAULT 'pending',
      submitted_at      DATETIME,
      reopened_at       DATETIME,
      created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (jury_assignment_id) REFERENCES jury_assignments(id),
      FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (jury_member_id) REFERENCES jury_members(id),
      FOREIGN KEY (round_id) REFERENCES rounds(id)
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS evaluation_scores (
      id            VARCHAR(36) PRIMARY KEY,
      evaluation_id VARCHAR(36) NOT NULL,
      criteria_id   VARCHAR(36) NOT NULL,
      score         DECIMAL(8,2) NOT NULL DEFAULT 0,
      UNIQUE KEY uq_eval_criteria (evaluation_id, criteria_id),
      FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE,
      FOREIGN KEY (criteria_id) REFERENCES evaluation_criteria(id)
    )`);

    // Results
    await conn.query(`CREATE TABLE IF NOT EXISTS results (
      id               VARCHAR(36) PRIMARY KEY,
      team_id          VARCHAR(36) NOT NULL,
      round_id         VARCHAR(36) NOT NULL,
      internal_status  ENUM('pending','selected','rejected') NOT NULL DEFAULT 'pending',
      published_status ENUM('pending','selected','rejected') NOT NULL DEFAULT 'pending',
      is_published     BOOLEAN NOT NULL DEFAULT FALSE,
      published_at     DATETIME,
      award            VARCHAR(255),
      \`rank\`           INT,
      finalized_by     VARCHAR(36),
      finalized_at     DATETIME,
      notes            TEXT,
      UNIQUE KEY uq_team_round_result (team_id, round_id),
      FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (round_id) REFERENCES rounds(id),
      FOREIGN KEY (finalized_by) REFERENCES users(id)
    )`);

    // Operations
    await conn.query(`CREATE TABLE IF NOT EXISTS checkins (
      id            VARCHAR(36) PRIMARY KEY,
      team_id       VARCHAR(36) NOT NULL,
      checked_in_by VARCHAR(36),
      checked_in_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      notes         TEXT,
      FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (checked_in_by) REFERENCES users(id)
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS notifications (
      id           VARCHAR(36) PRIMARY KEY,
      type         VARCHAR(100) NOT NULL,
      recipient_id VARCHAR(36),
      subject      VARCHAR(500),
      body         TEXT,
      sent_at      DATETIME,
      status       ENUM('pending','sent','failed') NOT NULL DEFAULT 'pending',
      created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recipient_id) REFERENCES users(id)
    )`);

    await conn.query(`CREATE TABLE IF NOT EXISTS audit_logs (
      id          VARCHAR(36) PRIMARY KEY,
      actor_id    VARCHAR(36),
      actor_role  VARCHAR(50),
      action      VARCHAR(255) NOT NULL,
      entity_type VARCHAR(100),
      entity_id   VARCHAR(36),
      metadata    JSON,
      ip_address  VARCHAR(45),
      created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (actor_id) REFERENCES users(id)
    )`);

    console.log('[Schema] All tables created successfully');

    // ---- Seed default event ----
    const [existingEvents] = await conn.query('SELECT id FROM events WHERE edition = ?', ['2027']);
    let eventId, round1Id;

    if (existingEvents.length === 0) {
      eventId = uuidv4();
      await conn.query(
        'INSERT INTO events (id, name, edition, host_college, tagline) VALUES (?, ?, ?, ?, ?)',
        [eventId, 'VISAI 2027', '2027', 'Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology', 'Innovate. Build. Present.']
      );

      const defaultSettings = [
        ['registration_open', 'true', 'boolean'],
        ['registration_fee_paise', '100000', 'number'],
        ['max_team_size', '4', 'number'],
        ['email_verification_required', 'false', 'boolean'],
        ['ppt_max_size_mb', '25', 'number'],
        ['allowed_file_types', '["ppt","pptx","pdf"]', 'json'],
        ['accommodation_message', 'Accommodation is not provided by VISAI. Participants are responsible for arranging their own accommodation.', 'string'],
        ['problem_selection_changeable', 'true', 'boolean'],
      ];
      for (const [key, value, type] of defaultSettings) {
        await conn.query(
          'INSERT IGNORE INTO event_settings (id, event_id, setting_key, setting_value, setting_type) VALUES (?, ?, ?, ?, ?)',
          [uuidv4(), eventId, key, value, type]
        );
      }

      round1Id = uuidv4();
      await conn.query(
        'INSERT INTO rounds (id, event_id, round_number, name, description, status) VALUES (?, ?, ?, ?, ?, ?)',
        [round1Id, eventId, 1, 'Round 1 — Submission', 'Initial abstract and PPT submission round', 'open']
      );

      const defaultCriteria = [
        { name: 'Innovation', description: 'Novelty and creativity of the solution', max_score: 20 },
        { name: 'Technical Feasibility', description: 'Technical soundness and implementation quality', max_score: 20 },
        { name: 'Problem Understanding', description: 'Depth of understanding of the problem statement', max_score: 20 },
        { name: 'Impact', description: 'Real-world impact and SDG alignment', max_score: 20 },
        { name: 'Presentation', description: 'Clarity of communication and presentation quality', max_score: 20 },
      ];
      for (let i = 0; i < defaultCriteria.length; i++) {
        const c = defaultCriteria[i];
        await conn.query(
          'INSERT INTO evaluation_criteria (id, event_id, round_id, name, description, max_score, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [uuidv4(), eventId, round1Id, c.name, c.description, c.max_score, i]
        );
      }

      console.log('[Schema] Default VISAI 2027 event, Round 1, and evaluation criteria seeded');
    } else {
      eventId = existingEvents[0].id;
    }

    // ---- Seed super admin ----
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@visai.in';
    const [existingAdmins] = await conn.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    if (existingAdmins.length === 0) {
      const adminId = uuidv4();
      const hash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'Admin@VISAI2027', 12);
      await conn.query(
        'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [adminId, adminEmail, hash, 'super_admin']
      );
      await conn.query(
        'INSERT INTO user_profiles (id, user_id, full_name, email_verified) VALUES (?, ?, ?, ?)',
        [uuidv4(), adminId, process.env.SUPER_ADMIN_NAME || 'VISAI Super Admin', true]
      );
      console.log(`[Schema] Super admin created: ${adminEmail}`);
    }

    console.log('[Schema] Database initialization complete');
  } catch (err) {
    console.error('[Schema] Error:', err.message);
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { initializeDatabase };
