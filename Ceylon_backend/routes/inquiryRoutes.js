const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getAllInquiries,
  validateInquiry,
} = require('../controllers/inquiryController');

// POST  /api/inquiries  — submit new inquiry
router.post('/', validateInquiry, submitInquiry);

// GET   /api/inquiries  — get all inquiries (admin use)
router.get('/', getAllInquiries);

module.exports = router;
