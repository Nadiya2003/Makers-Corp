const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getAllInquiries,
  validateInquiry,
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');

// POST  /api/inquiries  — submit new inquiry
router.post('/', validateInquiry, submitInquiry);

// GET   /api/inquiries  — get all inquiries (admin use)
router.get('/', protect, getAllInquiries);

module.exports = router;
