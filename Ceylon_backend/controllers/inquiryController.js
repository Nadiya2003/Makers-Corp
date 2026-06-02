const { body, validationResult } = require('express-validator');
const Inquiry = require('../models/Inquiry');
const { Resend } = require('resend');

// ─── Validation Rules ─────────────────────────────────────────────────────────
const validateInquiry = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('vehicle')
    .notEmpty()
    .withMessage('Invalid vehicle brand'),
  body('message').optional().trim(),
];

// ─── POST /api/inquiries ──────────────────────────────────────────────────────
const submitInquiry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, phone, vehicle, message } = req.body;

    const inquiry = await Inquiry.create({ name, phone, vehicle, message });

    if (process.env.RESEND_API && process.env.RECEIVE_EMAIL && process.env.SEND_EMAIL) {
      try {
        const resend = new Resend(process.env.RESEND_API);
        await resend.emails.send({
          from: process.env.SEND_EMAIL,
          to: process.env.RECEIVE_EMAIL,
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

// ─── DELETE /api/inquiries/:id ────────────────────────────────────────────────
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    return res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    console.error('deleteInquiry error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { submitInquiry, getAllInquiries, validateInquiry, deleteInquiry };
