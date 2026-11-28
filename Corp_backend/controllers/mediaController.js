const Media = require('../models/Media');
const { cloudinary, uploadBuffer } = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

// Determine if Cloudinary is properly configured
function isCloudinaryConfigured() {
  const cfg = cloudinary.config();
  return !!(cfg.cloud_name && cfg.api_key && cfg.api_secret);
}

// Save file to local disk and return a served URL
function saveLocally(buffer, originalname) {
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'vehicles');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const ext = path.extname(originalname) || '.jpg';
  const baseName = path.basename(originalname, ext).replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `${baseName}_${Date.now()}${ext}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  // Return a URL path that will be served by Express /public static middleware
  return `/public/uploads/vehicles/${filename}`;
}

// Get all media
const getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new media (Multiple uploads) — with Cloudinary or local fallback
const addMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one photo' });
    }

    const useCloudinary = isCloudinaryConfigured();
    const mediaEntries = [];

    for (const file of req.files) {
      let url;
      let publicId = null;

      if (useCloudinary) {
        try {
          const result = await uploadBuffer(file.buffer);
          url = result.secure_url;
          publicId = result.public_id;
        } catch (cloudErr) {
          console.warn('Cloudinary upload failed, falling back to local storage:', cloudErr.message);
          url = saveLocally(file.buffer, file.originalname);
        }
      } else {
        // No Cloudinary configured — use local disk
        url = saveLocally(file.buffer, file.originalname);
      }

      const newMedia = await Media.create({
        name: file.originalname,
        url,
        publicId,
        category: req.body.category || 'General'
      });
      mediaEntries.push(newMedia);
    }

    res.status(201).json({
      success: true,
      message: `${req.files.length} photo(s) uploaded successfully`,
      data: mediaEntries
    });
  } catch (error) {
    console.error('Media upload error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete media
const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // Delete from Cloudinary if applicable
    if (media.publicId && isCloudinaryConfigured()) {
      try {
        await cloudinary.uploader.destroy(media.publicId, { invalidate: true });
      } catch (e) {
        console.error('Cloudinary delete failed:', e.message);
      }
    }

    // Delete local file if applicable
    if (media.url && media.url.startsWith('/public/uploads/')) {
      try {
        const localPath = path.join(__dirname, '..', media.url.replace(/^\/public\//, 'public/'));
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      } catch (e) {
        console.error('Local file delete failed:', e.message);
      }
    }

    await media.deleteOne();
    res.json({ success: true, message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMedia, addMedia, deleteMedia };
