const SiteSettings = require('../models/SiteSettings');

// Helper: flatten nested object into dot-notation keys for safe $set updates
// e.g. { contactPage: { googleMapUrl: 'x' } } → { 'contactPage.googleMapUrl': 'x' }
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(acc, flattenObject(val, fullKey));
    } else {
      acc[fullKey] = val;
    }
    return acc;
  }, {});
}

const DEFAULT_SPECS = [
  { key: 'year',         label: 'Year',         icon: 'Calendar', visible: true,  isDefault: true,  order: 0 },
  { key: 'fuel',         label: 'Fuel Type',    icon: 'Fuel',     visible: true,  isDefault: true,  order: 1 },
  { key: 'transmission', label: 'Transmission', icon: 'Settings', visible: true,  isDefault: true,  order: 2 },
  { key: 'engine',       label: 'Engine',       icon: 'Zap',      visible: true,  isDefault: true,  order: 3 },
  { key: 'mileage',      label: 'Mileage',      icon: 'Gauge',    visible: true,  isDefault: true,  order: 4 },
  { key: 'drive',        label: 'Drive Type',   icon: 'Info',     visible: true,  isDefault: true,  order: 5 },
  { key: 'seats',        label: 'Seats',        icon: 'Users',    visible: true,  isDefault: true,  order: 6 },
  { key: 'color',        label: 'Color',        icon: 'Palette',  visible: true,  isDefault: true,  order: 7 }
];

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await SiteSettings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      // Strip read-only database fields to prevent cast or modification errors
      const updateData = { ...req.body };
      delete updateData._id;
      delete updateData.__v;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      // Use $set with dot-notation so only sent fields are updated.
      // This prevents saving contact info from wiping homepage/seo/theme data.
      const flatBody = flattenObject(updateData);
      settings = await SiteSettings.findOneAndUpdate(
        {},
        { $set: flatBody },
        { new: true, runValidators: true }
      );
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get vehicle spec settings
// @route   GET /api/settings/vehicle-specs
// @access  Public
exports.getVehicleSpecs = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    // Return stored specs or fall back to defaults
    const specs = (settings.vehicleSpecs && settings.vehicleSpecs.length > 0)
      ? settings.vehicleSpecs
      : DEFAULT_SPECS;
    res.status(200).json({ success: true, data: specs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vehicle spec settings
// @route   PUT /api/settings/vehicle-specs
// @access  Private/Admin
exports.updateVehicleSpecs = async (req, res) => {
  try {
    const { specs } = req.body;
    if (!Array.isArray(specs)) {
      return res.status(400).json({ success: false, message: 'specs must be an array' });
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ vehicleSpecs: specs });
    } else {
      settings = await SiteSettings.findOneAndUpdate(
        {},
        { $set: { vehicleSpecs: specs } },
        { new: true, runValidators: true }
      );
    }
    res.status(200).json({ success: true, data: settings.vehicleSpecs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
