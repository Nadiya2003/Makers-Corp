const Article = require('../models/Article');

// Helper to generate slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all articles (with filter and pagination)
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res) => {
  try {
    const { category, featured, published, search } = req.query;
    const filter = {};

    if (category && category !== 'ALL') {
      filter.category = category;
    }
    if (featured !== undefined) {
      filter.isFeatured = featured === 'true';
    }
    if (published !== undefined) {
      filter.isPublished = published === 'true';
    } else if (!req.user) {
      // Public visitors only see published articles
      filter.isPublished = true;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const articles = await Article.find(filter).sort({ publishedAt: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single article by slug or id
// @route   GET /api/articles/:slugOrId
// @access  Public
exports.getArticle = async (req, res) => {
  try {
    const raw = req.params.slugOrId;
    const slugOrId = decodeURIComponent(raw);
    let article;
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      article = await Article.findById(slugOrId);
    }
    if (!article) {
      const escaped = slugOrId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      article = await Article.findOne({
        $or: [
          { slug: slugOrId },
          { slug: { $regex: `^${escaped}$`, $options: 'i' } }
        ]
      });
    }

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private/Admin
exports.createArticle = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.slug && body.title) {
      body.slug = slugify(body.title);
    }
    const article = await Article.create(body);
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Admin
exports.updateArticle = async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const body = { ...req.body };
    if (body.title && !body.slug) {
      body.slug = slugify(body.title);
    }

    article = await Article.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
