const Review = require('../models/Review');

// @desc    Get all published reviews (for public frontend)
// @route   GET /api/reviews
// @access  Public
exports.getPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isPublished: true })
      .sort({ isFeatured: -1, reviewDate: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews including drafts (for admin dashboard)
// @route   GET /api/reviews/admin
// @access  Private
exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const { search, status, rating } = req.query;
    const filter = {};

    if (status === 'published') filter.isPublished = true;
    if (status === 'draft') filter.isPublished = false;
    if (status === 'featured') filter.isFeatured = true;

    if (rating && !isNaN(Number(rating))) {
      filter.rating = Number(rating);
    }

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { reviewText: { $regex: search, $options: 'i' } }
      ];
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const {
      customerName,
      country,
      companyName,
      designation,
      rating,
      reviewText,
      reviewDate,
      avatar,
      isPublished,
      isFeatured
    } = req.body;

    if (!customerName || !country || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, country, and review text are required.'
      });
    }

    const review = await Review.create({
      customerName,
      country,
      companyName: companyName || '',
      designation: designation || '',
      rating: Number(rating) || 5,
      reviewText,
      reviewDate: reviewDate ? new Date(reviewDate) : new Date(),
      avatar: avatar || '',
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      isFeatured: Boolean(isFeatured)
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Review removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
