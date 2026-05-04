const { body, validationResult } = require('express-validator');
const Inquiry = require('../models/Inquiry');
const nodemailer = require('nodemailer');

// ─── Validation Rules ─────────────────────────────────────────────────────────
const validateInquiry = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('vehicle')
    .notEmpty()
    .isIn(['Toyota', 'Honda', 'Nissan', 'Suzuki', 'Mazda', 'Other'])
    .withMessage('Invalid vehicle brand'),
  body('message').optional().trim(),
];

// ─── POST /api/inquiries ──────────────────────────────────────────────────────
const submitInquiry = async (req, res) => {
  // Run validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, phone, vehicle, message } = req.body;

    // Save to DB
    const inquiry = await Inquiry.create({ name, phone, vehicle, message });

    // Send notification email (optional – silently fails if not configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `New Inquiry from ${name}`,
          html: `
            <h2>New Vehicle Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Interested in:</strong> ${vehicle}</p>
            <p><strong>Message:</strong> ${message || '—'}</p>
          `,
        });
      } catch (mailErr) {
        console.warn('Email notification failed:', mailErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. We will contact you shortly.',
      data: inquiry,
    });
  } catch (err) {
    console.error('submitInquiry error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET /api/inquiries ───────────────────────────────────────────────────────
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: inquiries });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { submitInquiry, getAllInquiries, validateInquiry };
