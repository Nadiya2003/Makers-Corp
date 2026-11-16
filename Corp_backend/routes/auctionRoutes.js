const express = require('express');
const router = express.Router();
const { getAuctions, createAuction, updateAuction, deleteAuction } = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAuctions);
router.post('/', protect, createAuction);
router.put('/:id', protect, updateAuction);
router.delete('/:id', protect, deleteAuction);

module.exports = router;
