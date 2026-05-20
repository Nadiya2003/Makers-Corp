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
