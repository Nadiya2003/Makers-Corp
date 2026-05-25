const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getVehicleSpecs, updateVehicleSpecs } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSettings)
  .put(protect, updateSettings);

router.route('/vehicle-specs')
  .get(getVehicleSpecs)
  .put(protect, updateVehicleSpecs);

module.exports = router;
