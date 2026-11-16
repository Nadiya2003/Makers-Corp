const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getAllInquiries,
  validateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');

// POST   /api/inquiries       — submit new inquiry
router.post('/', validateInquiry, submitInquiry);

// GET    /api/inquiries       — get all inquiries (admin use)
router.get('/', protect, getAllInquiries);

// DELETE /api/inquiries/:id   — delete an inquiry (admin use)
router.delete('/:id', protect, deleteInquiry);

module.exports = router;
