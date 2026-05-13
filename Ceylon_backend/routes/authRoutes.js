const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, resetPassword, getUsers, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/', protect, getUsers);
router.delete('/:id', protect, deleteUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router;
