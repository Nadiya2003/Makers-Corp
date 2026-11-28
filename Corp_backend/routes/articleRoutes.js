const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getArticles)
  .post(protect, createArticle);

router.route('/:slugOrId')
  .get(getArticle)
  .put(protect, updateArticle)
  .delete(protect, deleteArticle);

module.exports = router;
