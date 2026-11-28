const express = require('express');
const router = express.Router();
const {
  getPublicReviews,
  getAllReviewsAdmin,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public route: fetch published reviews
router.get('/', getPublicReviews);

// Admin route: fetch all reviews (drafts + published)
router.get('/admin', protect, getAllReviewsAdmin);

// Single review detail
router.get('/:id', getReviewById);

// Admin mutation routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
