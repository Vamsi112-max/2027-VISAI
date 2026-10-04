const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./database');
const bcrypt = require('bcrypt');

async function seedTiDB() {
  console.log('[TiDB Seed] Seeding problem statements, jury and demo data...');
  try {
    const [[event]] = await pool.query('SELECT id FROM events LIMIT 1');
    const eventId = event?.id || 'ev-2027';

    const SEED_PS = [
      ['ps-sdg07-1', 'VISAI-SDG07-IND01', 'Solar Microgrid Dynamic Load Balancing & Battery Telemetry', 'SDG 07: Affordable & Clean Energy', 'NICOLA FOUNDATION'],
      ['ps-sdg06-1', 'VISAI-SDG06-IND01', 'Smart Acoustic Leak Detection & Purity Sensor Mesh', 'SDG 06: Clean Water & Sanitation', 'IEEE PSES'],
      ['ps-sdg11-1', 'VISAI-SDG11-IND01', 'Vision-Based Adaptive Traffic Signal Optimization & Emergency Corridors', 'SDG 11: Sustainable Cities', 'CREDAI CHENNAI'],
      ['ps-sdg09-1', 'VISAI-SDG09-IND01', 'Predictive Vibration Anomaly Detection in Industrial High-Speed Drives', 'SDG 09: Industry, Innovation & Infrastructure', 'TURBO ENERGY (TEL)'],
      ['ps-sdg13-1', 'VISAI-SDG13-IND01', 'Hyperlocal Greenhouse Gas Telemetry & Carbon Offset Verification', 'SDG 13: Climate Action', 'VIRUKSA'],
      ['ps-sdg14-1', 'VISAI-SDG14-IND01', 'Autonomous Surface Skimmer for Ocean Microplastics & Marine Health', 'SDG 14: Life Below Water', 'AMREP'],
      ['ps-sdg12-1', 'VISAI-SDG12-IND01', 'Automated E-Waste Disassembly & Rare Earth Component Sorter', 'SDG 12: Responsible Consumption', 'CBS Technologies'],
      ['ps-sdg15-1', 'VISAI-SDG15-IND01', 'Multispectral Drone Crop Health Telemetry & Soil Nitrogen Sensing', 'SDG 15: Life on Land', 'Vel Tech TBI']
    ];

    for (const [id, code, title, track, partner] of SEED_PS) {
      await pool.query(
        `INSERT IGNORE INTO problem_statements (id, event_id, ps_code, title, track, category, short_description, full_description, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
        [id, eventId, code, title, track, partner, `Official industrial challenge statement supported by ${partner}`, `Comprehensive innovation statement for ${title}`]
      );
    }

    // Seed Jury
    const juryHash = await bcrypt.hash('jury123', 10);
    await pool.query(
      `INSERT IGNORE INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      ['usr-jury-01', 'jury.ai@visai.in', juryHash, 'jury']
    );
    await pool.query(
      `INSERT IGNORE INTO user_profiles (id, user_id, full_name, phone, email_verified) VALUES (?, ?, ?, ?, ?)`,
      ['prof-jury-01', 'usr-jury-01', 'Dr. Arvind Swaminathan (Jury Lead)', '+91 98765 11223', true]
    );
    await pool.query(
      `INSERT IGNORE INTO jury_members (id, user_id, expertise, affiliation) VALUES (?, ?, ?, ?)`,
      ['jm-01', 'usr-jury-01', 'SDG 09: Industry & AI', 'Microsoft Cloud & AI']
    );

    // Seed Demo Team
    const leaderHash = await bcrypt.hash('visai2027', 10);
    await pool.query(
      `INSERT IGNORE INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      ['usr-lead-01', 'leader@visai.in', leaderHash, 'participant']
    );
    await pool.query(
      `INSERT IGNORE INTO user_profiles (id, user_id, full_name, phone, email_verified) VALUES (?, ?, ?, ?, ?)`,
      ['prof-lead-01', 'usr-lead-01', 'Aditya Verma (Team Lead)', '+91 98765 43210', true]
    );
    await pool.query(
      `INSERT IGNORE INTO teams (id, registration_number, event_id, leader_user_id, team_name, status, payment_status, is_locked)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['tm-8492', 'VISAI27-TM-8492', eventId, 'usr-lead-01', 'Team Innovate_X', 'shortlisted', 'paid', 0]
    );
    await pool.query(
      `INSERT IGNORE INTO team_leader_details (id, team_id, full_name, email, phone, college, department, year_of_study, student_id, verification_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['tld-01', 'tm-8492', 'Aditya Verma', 'leader@visai.in', '+91 98765 43210', 'IIT Bombay', 'Computer Science & Engineering', '3rd Year B.Tech', 'IITB-2024-CS104', 'VERIFIED']
    );
    await pool.query(
      `INSERT IGNORE INTO college_details (id, team_id, college_name, department, city, state, pincode, address, accommodation_acknowledged)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['cd-01', 'tm-8492', 'Indian Institute of Technology Bombay', 'Computer Science', 'Mumbai', 'Maharashtra', '400076', 'Powai, Mumbai', 1]
    );
    await pool.query(
      `INSERT IGNORE INTO team_problem_selections (id, team_id, problem_statement_id, round_id)
       VALUES (?, ?, ?, (SELECT id FROM rounds LIMIT 1))`,
      ['tps-01', 'tm-8492', 'ps-sdg09-1']
    );
    await pool.query(
      `INSERT IGNORE INTO payments (id, team_id, internal_order_id, razorpay_order_id, razorpay_payment_id, amount_paise, status, is_verified, invoice_approved, invoice_number)
       VALUES (?, ?, ?, ?, ?, ?, 'paid', 1, 1, ?)`,
      ['pay-tm-8492', 'tm-8492', 'VISAI27-ORD-8492', 'order_84920000000', 'pay_TjWTndAvEuQPFf_8492', 100000, 'INV-VISAI27-TM8492']
    );

    console.log('[TiDB Seed] Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[TiDB Seed] Error:', err.message);
    process.exit(1);
  }
}

seedTiDB();
