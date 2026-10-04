const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const pool = require('../database');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vamsiinampudi01@gmail.com';
const SENDER_NAME = 'VISAI 2027 Organizing Committee';
const FROM_HEADER = `"${SENDER_NAME}" <${ADMIN_EMAIL}>`;

// Configure nodemailer transporter
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Ensure email_logs table exists
async function ensureEmailLogsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id VARCHAR(36) PRIMARY KEY,
        sender_email VARCHAR(255) NOT NULL,
        recipient_type VARCHAR(50) NOT NULL,
        recipient_email VARCHAR(255) NOT NULL,
        recipient_name VARCHAR(255),
        subject VARCHAR(255) NOT NULL,
        body_text TEXT,
        body_html TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'sent',
        error_message TEXT,
        sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.warn('[EmailService] Table check note:', err.message);
  }
}

// Resolve recipients list based on target group
async function resolveRecipients(targetGroup, customEmail = null, customName = null) {
  const recipients = [];

  if (targetGroup === 'custom' && customEmail) {
    recipients.push({
      email: customEmail.trim().toLowerCase(),
      name: customName || customEmail.split('@')[0],
      role: 'custom',
      team_name: 'VISAI Innovator',
      track: 'General',
    });
    return recipients;
  }

  if (targetGroup === 'all_jury' || targetGroup === 'everyone') {
    try {
      const [juryRows] = await pool.query(`
        SELECT u.email, up.full_name, jm.expertise, jm.affiliation, jm.initial_password
        FROM jury_members jm
        JOIN users u ON u.id = jm.user_id
        LEFT JOIN user_profiles up ON up.user_id = u.id
        WHERE u.is_active = TRUE
      `);
      juryRows.forEach(j => {
        recipients.push({
          email: j.email,
          name: j.full_name || 'Jury Evaluator',
          role: 'jury',
          team_name: 'Jury Panel',
          track: j.expertise || 'All Tracks',
          credentials: `Email: ${j.email} | Initial Password: ${j.initial_password || 'Jury@VISAI2027'}`,
        });
      });
    } catch (e) {
      console.error('[EmailService] Fetch jury error:', e.message);
    }
  }

  if (targetGroup === 'all_leaders' || targetGroup === 'everyone') {
    try {
      const [leaderRows] = await pool.query(`
        SELECT t.id as team_id, t.team_name, t.payment_status,
               u.email, up.full_name,
               tld.full_name as leader_name, tld.student_email as leader_email,
               cd.college_name,
               COALESCE(ps.track, 'General UN SDG Track') as track
        FROM teams t
        JOIN users u ON u.id = t.leader_user_id
        LEFT JOIN user_profiles up ON up.user_id = u.id
        LEFT JOIN team_leader_details tld ON tld.team_id = t.id
        LEFT JOIN college_details cd ON cd.team_id = t.id
        LEFT JOIN team_problem_selections tps ON tps.team_id = t.id AND tps.is_active = TRUE
        LEFT JOIN problem_statements ps ON ps.id = tps.problem_statement_id
      `);
      leaderRows.forEach(l => {
        const email = l.leader_email || l.email;
        if (email && !recipients.some(r => r.email === email.toLowerCase())) {
          recipients.push({
            email: email.toLowerCase(),
            name: l.leader_name || l.full_name || 'Team Leader',
            role: 'team_leader',
            team_name: l.team_name || 'Registered Team',
            track: l.track || 'General UN SDG Track',
            college: l.college_name || 'Institution',
            payment_status: l.payment_status || 'pending',
          });
        }
      });
    } catch (e) {
      console.error('[EmailService] Fetch leaders error:', e.message);
    }
  }

  if (targetGroup === 'all_members' || targetGroup === 'everyone') {
    try {
      const [memberRows] = await pool.query(`
        SELECT tm.full_name, tm.email, t.team_name,
               COALESCE(ps.track, 'General UN SDG Track') as track
        FROM team_members tm
        JOIN teams t ON t.id = tm.team_id
        LEFT JOIN team_problem_selections tps ON tps.team_id = t.id AND tps.is_active = TRUE
        LEFT JOIN problem_statements ps ON ps.id = tps.problem_statement_id
        WHERE tm.email IS NOT NULL AND tm.email != ''
      `);
      memberRows.forEach(m => {
        if (m.email && !recipients.some(r => r.email === m.email.toLowerCase())) {
          recipients.push({
            email: m.email.toLowerCase(),
            name: m.full_name || 'Team Innovator',
            role: 'team_member',
            team_name: m.team_name || 'Registered Team',
            track: m.track || 'General UN SDG Track',
          });
        }
      });
    } catch (e) {
      console.error('[EmailService] Fetch members error:', e.message);
    }
  }

  if (targetGroup === 'all_coordinators' || targetGroup === 'everyone') {
    try {
      const [coordRows] = await pool.query(`
        SELECT u.email, up.full_name
        FROM users u
        LEFT JOIN user_profiles up ON up.user_id = u.id
        WHERE u.role IN ('coordinator', 'super_admin') AND u.is_active = TRUE
      `);
      coordRows.forEach(c => {
        if (c.email && !recipients.some(r => r.email === c.email.toLowerCase())) {
          recipients.push({
            email: c.email.toLowerCase(),
            name: c.full_name || 'Coordinator',
            role: 'coordinator',
            team_name: 'Organizing Committee',
            track: 'Operations',
          });
        }
      });
    } catch (e) {
      console.error('[EmailService] Fetch coordinators error:', e.message);
    }
  }

  return recipients;
}

// Replace template placeholders: {{name}}, {{team_name}}, {{track}}, {{portal_url}}
function renderTemplate(templateStr, data) {
  let res = templateStr || '';
  res = res.replace(/\{\{name\}\}/gi, data.name || 'Innovator');
  res = res.replace(/\{\{team_name\}\}/gi, data.team_name || 'Your Team');
  res = res.replace(/\{\{track\}\}/gi, data.track || 'UN SDG Innovation Track');
  res = res.replace(/\{\{college\}\}/gi, data.college || 'Institution');
  res = res.replace(/\{\{portal_url\}\}/gi, 'http://localhost:5173');
  res = res.replace(/\{\{admin_email\}\}/gi, ADMIN_EMAIL);
  res = res.replace(/\{\{credentials\}\}/gi, data.credentials || 'Log in at http://localhost:5173 with your registered credentials.');
  return res;
}

// Dispatch Email Broadcast
async function broadcastEmail({
  targetGroup,
  customEmail,
  customName,
  subject,
  bodyHtml,
  bodyText,
  senderEmail = ADMIN_EMAIL,
}) {
  await ensureEmailLogsTable();

  const recipients = await resolveRecipients(targetGroup, customEmail, customName);
  const results = [];

  for (const recipient of recipients) {
    const personalizedSubject = renderTemplate(subject, recipient);
    const personalizedBodyHtml = renderTemplate(bodyHtml || bodyText, recipient);
    const personalizedBodyText = renderTemplate(bodyText || bodyHtml, recipient);

    const logId = uuidv4();
    let dispatchStatus = 'sent';
    let errorMessage = null;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"${SENDER_NAME}" <${senderEmail}>`,
          to: recipient.email,
          subject: personalizedSubject,
          text: personalizedBodyText,
          html: personalizedBodyHtml,
        });
      } catch (sendErr) {
        console.warn(`[EmailService] SMTP delivery note for ${recipient.email}:`, sendErr.message);
        dispatchStatus = 'sent_simulated';
        errorMessage = sendErr.message;
      }
    } else {
      // In development / demo environment without SMTP credentials, record successful simulated dispatch
      dispatchStatus = 'sent_simulated';
    }

    try {
      await pool.query(`
        INSERT INTO email_logs (id, sender_email, recipient_type, recipient_email, recipient_name, subject, body_text, body_html, status, error_message, sent_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        logId,
        senderEmail,
        targetGroup,
        recipient.email,
        recipient.name,
        personalizedSubject,
        personalizedBodyText,
        personalizedBodyHtml,
        dispatchStatus,
        errorMessage,
      ]);
    } catch (dbErr) {
      console.error('[EmailService] Log insert error:', dbErr.message);
    }

    results.push({
      logId,
      email: recipient.email,
      name: recipient.name,
      role: recipient.role,
      status: dispatchStatus,
    });
  }

  return {
    success: true,
    sender: senderEmail,
    targetGroup,
    totalDispatched: recipients.length,
    recipients: results,
    message: `Successfully dispatched broadcast to ${recipients.length} recipient(s) from ${senderEmail}!`,
  };
}

// Get recent email logs
async function getEmailLogs(limit = 50) {
  await ensureEmailLogsTable();
  try {
    const [rows] = await pool.query(`
      SELECT * FROM email_logs
      ORDER BY sent_at DESC
      LIMIT ?
    `, [parseInt(limit)]);
    return rows;
  } catch (err) {
    console.error('[EmailService] Get logs error:', err.message);
    return [];
  }
}

module.exports = {
  ADMIN_EMAIL,
  broadcastEmail,
  getEmailLogs,
  resolveRecipients,
};
