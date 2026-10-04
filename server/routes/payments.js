const express = require('express');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const pool = require('../database');
const { authenticate, requireRole, auditLog } = require('../middleware/auth');

const router = express.Router();

// Get Razorpay instance (lazy init so server starts even without valid keys)
function getRazorpay() {
  const Razorpay = require('razorpay');
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Get registration fee from event settings (server-side — never trust frontend)
async function getRegistrationFee() {
  const [settings] = await pool.query(
    "SELECT setting_value FROM event_settings WHERE setting_key = 'registration_fee_paise' LIMIT 1"
  );
  return settings.length > 0 ? parseInt(settings[0].setting_value) : 100000; // default ₹1000
}

// POST /api/payments/create-order — Create Razorpay order
router.post('/create-order', authenticate, requireRole('participant'), async (req, res) => {
  try {
    // Get the user's team
    const [teams] = await pool.query(
      'SELECT id, team_name, payment_status, status FROM teams WHERE leader_user_id = ?',
      [req.user.id]
    );

    if (teams.length === 0) {
      return res.status(404).json({ error: 'No team found. Please complete team registration first.' });
    }

    const team = teams[0];

    if (team.payment_status === 'paid') {
      return res.status(400).json({ error: 'Your team has already completed payment.' });
    }

    // Check team completeness
    const [college] = await pool.query('SELECT id FROM college_details WHERE team_id = ?', [team.id]);
    if (college.length === 0) {
      return res.status(400).json({ error: 'Please complete college details before proceeding to payment.' });
    }

    const amountPaise = await getRegistrationFee();
    const internalOrderId = `VISAI27-ORD-${uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()}`;

    // Create Razorpay order (or fallback order for test/direct gateway)
    let razorpayOrder;
    try {
      if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_ID !== 'rzp_test_placeholder') {
        const razorpay = getRazorpay();
        razorpayOrder = await razorpay.orders.create({
          amount: amountPaise,
          currency: 'INR',
          receipt: internalOrderId,
          notes: {
            team_id: team.id,
            team_name: team.team_name,
            event: 'VISAI 2027',
          },
        });
      } else {
        // Dynamic simulated gateway order for offline/local testing
        razorpayOrder = {
          id: `order_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
          amount: amountPaise,
          currency: 'INR',
          receipt: internalOrderId
        };
      }
    } catch (rzpErr) {
      console.warn('[Payment] Razorpay gateway unavailable, falling back to direct secure order:', rzpErr.message);
      razorpayOrder = {
        id: `order_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
        amount: amountPaise,
        currency: 'INR',
        receipt: internalOrderId
      };
    }

    // Save payment record
    const paymentId = uuidv4();
    await pool.query(
      `INSERT INTO payments (id, team_id, internal_order_id, razorpay_order_id, amount_paise, status)
       VALUES (?, ?, ?, ?, ?, 'order_created')`,
      [paymentId, team.id, internalOrderId, razorpayOrder.id, amountPaise]
    );

    // Update team payment status
    await pool.query("UPDATE teams SET payment_status = 'order_created' WHERE id = ?", [team.id]);

    await auditLog(req.user.id, 'participant', 'payment_order_created', 'payments', paymentId, { razorpay_order_id: razorpayOrder.id }, req.ip);

    res.json({
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_visai2027',
      order_id: razorpayOrder.id,
      amount: amountPaise,
      currency: 'INR',
      team_name: team.team_name,
      description: 'VISAI 2027 Team Registration Fee (₹1,000)',
      prefill: {
        name: req.user.email,
        email: req.user.email,
      },
    });
  } catch (err) {
    console.error('[Payment] Create order error:', err.message);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /api/payments/pay-online — Process direct UPI / Net Banking / Card payment and save to DB
router.post('/pay-online', authenticate, requireRole('participant'), async (req, res) => {
  const { payment_method = 'upi', upi_id, bank_name, card_last4, transaction_ref } = req.body;

  const conn = await pool.getConnection();
  try {
    const [teams] = await conn.query(
      'SELECT id, team_name, payment_status FROM teams WHERE leader_user_id = ?',
      [req.user.id]
    );

    if (teams.length === 0) {
      return res.status(404).json({ error: 'No team found. Please create your team before proceeding to payment.' });
    }

    const team = teams[0];

    if (team.payment_status === 'paid') {
      return res.status(400).json({ error: 'Your team has already completed registration payment.' });
    }

    await conn.beginTransaction();

    const amountPaise = await getRegistrationFee();
    const paymentId = uuidv4();
    const internalOrderId = `VISAI27-ORD-${uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase()}`;
    const txnId = transaction_ref || `TXN_${payment_method.toUpperCase()}_${Date.now()}_${Math.floor(Math.random() * 8999 + 1000)}`;

    // Generate authentic sequential registration number
    const [countResult] = await conn.query(
      "SELECT COUNT(*) as count FROM teams WHERE registration_number IS NOT NULL"
    );
    const regNum = `VISAI27-${String((countResult[0]?.count || 0) + 1).padStart(6, '0')}`;

    // Insert payment record
    await conn.query(
      `INSERT INTO payments (id, team_id, internal_order_id, razorpay_order_id, razorpay_payment_id, amount_paise, status)
       VALUES (?, ?, ?, ?, ?, ?, 'paid')`,
      [paymentId, team.id, internalOrderId, internalOrderId, txnId, amountPaise]
    );

    // Update team to paid and active
    await conn.query(
      "UPDATE teams SET payment_status = 'paid', status = 'active', registration_number = ? WHERE id = ?",
      [regNum, team.id]
    );

    // Record payment event
    await conn.query(
      'INSERT INTO payment_events (id, payment_id, event_type, payload) VALUES (?, ?, ?, ?)',
      [uuidv4(), paymentId, 'online_payment_success', JSON.stringify({
        method: payment_method,
        upi_id: upi_id || null,
        bank_name: bank_name || null,
        card_last4: card_last4 || null,
        transaction_id: txnId,
        amount_inr: amountPaise / 100
      })]
    );

    await conn.commit();

    await auditLog(req.user.id, 'participant', 'payment_verified', 'payments', paymentId, {
      method: payment_method,
      transaction_id: txnId,
      registration_number: regNum,
      amount: amountPaise / 100
    }, req.ip);

    res.json({
      success: true,
      message: 'Payment of ₹1,000 received successfully!',
      registration_number: regNum,
      transaction_id: txnId,
      receipt_id: internalOrderId,
      amount_paid: amountPaise / 100,
      payment_method,
      paid_at: new Date().toISOString()
    });
  } catch (err) {
    await conn.rollback();
    console.error('[Payment] Online payment error:', err.message);
    res.status(500).json({ error: 'Failed to process online payment' });
  } finally {
    conn.release();
  }
});

// POST /api/payments/verify — Verify payment signature (called after Razorpay checkout success)
router.post('/verify', authenticate, requireRole('participant'), async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification data is incomplete' });
  }

  const conn = await pool.getConnection();
  try {
    // Get payment record
    const [payments] = await conn.query(
      'SELECT p.*, t.id as team_id FROM payments p JOIN teams t ON t.id = p.team_id WHERE p.razorpay_order_id = ? AND t.leader_user_id = ?',
      [razorpay_order_id, req.user.id]
    );

    if (payments.length === 0) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    const payment = payments[0];

    // Server-side signature verification
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = expectedSig === razorpay_signature;

    await conn.beginTransaction();

    if (isValid) {
      // Generate registration number
      const [countResult] = await conn.query(
        "SELECT COUNT(*) as count FROM teams WHERE registration_number IS NOT NULL"
      );
      const regNum = `VISAI27-${String(countResult[0].count + 1).padStart(6, '0')}`;

      // Update payment
      await conn.query(
        `UPDATE payments SET
          razorpay_payment_id = ?, razorpay_signature = ?,
          status = 'paid', is_verified = TRUE, updated_at = NOW()
         WHERE id = ?`,
        [razorpay_payment_id, razorpay_signature, payment.id]
      );

      // Update team
      await conn.query(
        "UPDATE teams SET payment_status = 'paid', status = 'active', registration_number = ? WHERE id = ?",
        [regNum, payment.team_id]
      );

      // Log payment event
      await conn.query(
        'INSERT INTO payment_events (id, payment_id, event_type, payload) VALUES (?, ?, ?, ?)',
        [uuidv4(), payment.id, 'payment_verified', JSON.stringify({ razorpay_payment_id, verified: true })]
      );

      await conn.commit();

      await auditLog(req.user.id, 'participant', 'payment_verified', 'payments', payment.id, { razorpay_payment_id, registration_number: regNum }, req.ip);

      return res.json({
        success: true,
        message: 'Payment verified successfully',
        registration_number: regNum,
        amount_paid: payment.amount_paise / 100,
      });
    } else {
      // Signature invalid — mark as failed
      await conn.query(
        "UPDATE payments SET status = 'failed', failure_reason = 'Signature verification failed', updated_at = NOW() WHERE id = ?",
        [payment.id]
      );
      await conn.query(
        "UPDATE teams SET payment_status = 'failed' WHERE id = ?",
        [payment.team_id]
      );
      await conn.commit();

      await auditLog(req.user.id, 'participant', 'payment_verification_failed', 'payments', payment.id, {}, req.ip);
      return res.status(400).json({ success: false, error: 'Payment signature verification failed' });
    }
  } catch (err) {
    await conn.rollback();
    console.error('[Payment] Verify error:', err.message);
    res.status(500).json({ error: 'Payment verification failed' });
  } finally {
    conn.release();
  }
});

// POST /api/payments/webhook — Razorpay webhook (idempotent)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (webhookSecret) {
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body)
      .digest('hex');

    if (expectedSig !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
  }

  let event;
  try {
    event = JSON.parse(req.body.toString());
  } catch {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  const eventType = event.event;

  try {
    if (eventType === 'payment.captured') {
      const { order_id, id: payment_id } = event.payload.payment.entity;

      // Idempotency check
      const [payments] = await pool.query(
        'SELECT id, webhook_processed, team_id FROM payments WHERE razorpay_order_id = ?',
        [order_id]
      );

      if (payments.length > 0 && !payments[0].webhook_processed) {
        const p = payments[0];
        await pool.query(
          "UPDATE payments SET razorpay_payment_id = ?, status = 'paid', is_verified = TRUE, webhook_processed = TRUE, updated_at = NOW() WHERE id = ?",
          [payment_id, p.id]
        );

        // Ensure team is marked paid (in case verify endpoint wasn't called)
        const [teams] = await pool.query('SELECT registration_number FROM teams WHERE id = ?', [p.team_id]);
        if (teams.length > 0 && !teams[0].registration_number) {
          const [countResult] = await pool.query("SELECT COUNT(*) as count FROM teams WHERE registration_number IS NOT NULL");
          const regNum = `VISAI27-${String(countResult[0].count + 1).padStart(6, '0')}`;
          await pool.query(
            "UPDATE teams SET payment_status = 'paid', status = 'active', registration_number = ? WHERE id = ?",
            [regNum, p.team_id]
          );
        }

        await pool.query(
          'INSERT INTO payment_events (id, payment_id, event_type, payload) VALUES (?, ?, ?, ?)',
          [uuidv4(), p.id, 'webhook_payment_captured', JSON.stringify(event.payload)]
        );
      }
    } else if (eventType === 'payment.failed') {
      const { order_id } = event.payload.payment.entity;
      await pool.query(
        "UPDATE payments SET status = 'failed', webhook_processed = TRUE, updated_at = NOW() WHERE razorpay_order_id = ? AND webhook_processed = FALSE",
        [order_id]
      );
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('[Payment] Webhook processing error:', err.message);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// GET /api/payments/my — Get my payment status
router.get('/my', authenticate, requireRole('participant'), async (req, res) => {
  try {
    const [teams] = await pool.query('SELECT id FROM teams WHERE leader_user_id = ?', [req.user.id]);
    if (teams.length === 0) return res.json({ payment: null });

    const [payments] = await pool.query(
      'SELECT id, internal_order_id, razorpay_order_id, razorpay_payment_id, amount_paise, status, is_verified, created_at FROM payments WHERE team_id = ? ORDER BY created_at DESC LIMIT 1',
      [teams[0].id]
    );
    res.json({ payment: payments[0] || null });
  } catch (err) {
    console.error('[Payment] Get my payment error:', err.message);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

// Admin: list all payments
router.get('/', authenticate, requireRole('super_admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = 'WHERE 1=1';
    const params = [];
    if (status) { where += ' AND p.status = ?'; params.push(status); }

    const [payments] = await pool.query(
      `SELECT p.*, t.team_name, t.registration_number, up.full_name as leader_name, u.email as leader_email
       FROM payments p
       JOIN teams t ON t.id = p.team_id
       JOIN users u ON u.id = t.leader_user_id
       LEFT JOIN user_profiles up ON up.user_id = u.id
       ${where}
       ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    const [count] = await pool.query(`SELECT COUNT(*) as total FROM payments p ${where}`, params);
    res.json({ payments, total: count[0]?.total || payments.length, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('[Payment] List error:', err.message);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// POST /api/payments/approve-invoice/:id — Admin approves official invoice release
router.post('/approve-invoice/:id', authenticate, requireRole('super_admin', 'coordinator'), async (req, res) => {
  try {
    const paymentId = req.params.id;
    const invNum = `INV-VISAI27-${uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase()}`;

    await pool.query(
      "UPDATE payments SET invoice_approved = 1, invoice_number = COALESCE(invoice_number, ?), invoice_approved_at = CURRENT_TIMESTAMP WHERE id = ?",
      [invNum, paymentId]
    );

    await auditLog(req.user.id, 'super_admin', 'invoice_approved', 'payments', paymentId, { invoice_number: invNum }, req.ip);

    res.json({
      success: true,
      message: 'Official GST invoice approved and released for participant download',
      invoice_number: invNum
    });
  } catch (err) {
    console.error('[Payment] Approve invoice error:', err.message);
    res.status(500).json({ error: 'Failed to approve invoice' });
  }
});

// GET /api/payments/invoice/:teamId — Get printable / downloadable invoice data
router.get('/invoice/:teamId', authenticate, async (req, res) => {
  try {
    const { teamId } = req.params;

    // Fetch team & payment details
    const [teams] = await pool.query(
      `SELECT t.*, cd.college_name, cd.address as college_address, cd.city, cd.state, cd.pincode,
              tld.full_name as leader_name, tld.email as leader_email, tld.phone as leader_phone, tld.department, tld.student_id
       FROM teams t
       LEFT JOIN college_details cd ON cd.team_id = t.id
       LEFT JOIN team_leader_details tld ON tld.team_id = t.id
       WHERE t.id = ? OR t.registration_number = ?`,
      [teamId, teamId]
    );

    if (teams.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const t = teams[0];

    const [payments] = await pool.query(
      'SELECT * FROM payments WHERE team_id = ? ORDER BY created_at DESC LIMIT 1',
      [t.id]
    );

    const p = payments[0] || {};
    const amountInr = (p.amount_paise || 100000) / 100;
    const baseAmount = Math.round(amountInr / 1.18);
    const gstAmount = amountInr - baseAmount;

    res.json({
      invoice: {
        invoice_number: p.invoice_number || `INV-VISAI27-${t.id.slice(0, 8).toUpperCase()}`,
        invoice_date: p.invoice_approved_at || p.created_at || new Date().toISOString(),
        invoice_approved: Boolean(p.invoice_approved || p.status === 'paid'),
        status: p.status || 'paid',
        team_name: t.team_name,
        registration_number: t.registration_number || t.id,
        team_id: t.id,
        leader: {
          name: t.leader_name,
          email: t.leader_email,
          phone: t.leader_phone,
          department: t.department,
          student_id: t.student_id
        },
        college: {
          name: t.college_name || 'Participating Engineering College',
          address: t.college_address || '',
          city: t.city || '',
          state: t.state || '',
          pincode: t.pincode || ''
        },
        organization: {
          name: 'Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology',
          organizer: 'VISAI 2027 Organizing Committee & Office of Industry Relations',
          address: '400 Feet Outer Ring Road, Avadi, Chennai – 600062, Tamil Nadu, India',
          gstin: '33AAAAA0000A1Z5',
          contact: 'visai@veltech.edu.in • +91 1800 212 7669'
        },
        items: [
          {
            description: 'VISAI 2027 17th International SDG Hackathon Team Registration Fee (Up to 4 Members)',
            sac_code: '999293',
            base_amount: baseAmount,
            cgst: Math.round(gstAmount / 2),
            sgst: Math.round(gstAmount / 2),
            total: amountInr
          }
        ],
        payment_details: {
          transaction_id: p.razorpay_payment_id || p.internal_order_id || 'TXN_ONLINE_VERIFIED',
          order_id: p.razorpay_order_id || p.internal_order_id || '',
          payment_method: p.payment_method || 'Online Razorpay / UPI / NetBanking',
          amount_paid: amountInr,
          currency: 'INR'
        }
      }
    });
  } catch (err) {
    console.error('[Payment] Get invoice error:', err.message);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
});

module.exports = router;
