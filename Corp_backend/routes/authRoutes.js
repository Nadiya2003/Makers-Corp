const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, resetPassword, getUsers, deleteUser, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public route: login & password recovery
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// Protected routes (admin/staff only)
router.get('/me', protect, getMe);
router.post('/register', protect, register); // Only authenticated admin can create new admin/staff
router.put('/change-password', protect, changePassword);
router.get('/', protect, getUsers);
router.delete('/:id', protect, deleteUser);

module.exports = router;
