const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// ─── Validation Rules ─────────────────────────────────────────────────────────
const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('vehicle')
    .notEmpty()
    .isIn(['Toyota', 'Honda', 'Nissan', 'Suzuki', 'Mazda', 'Other'])
    .withMessage('Invalid vehicle brand'),
  body('message').optional().trim(),
];

// ─── POST /api/contact ────────────────────────────────────────────────────────
const submitContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, phone, vehicle, message } = req.body;

    const contact = await Contact.create({ name, phone, vehicle, message });

    // Email notification
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
          subject: `New Contact Message from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
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
      message: 'Message sent successfully! We will get back to you soon.',
      data: contact,
    });
  } catch (err) {
    console.error('submitContact error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { submitContact, validateContact };
