const express = require('express');
const router = express.Router();
const {
  submitContact,
  validateContact,
} = require('../controllers/contactController');

// POST  /api/contact  — submit contact form
router.post('/', validateContact, submitContact);

module.exports = router;
