const Media = require('../models/Media');
const fs = require('fs');
const path = require('path');

// Get all media
const getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new media (Multiple uploads)
const addMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one photo' });
    }

    const apiUrl = `${req.protocol}://${req.get('host')}`;
    const mediaEntries = [];

    for (const file of req.files) {
      const newMedia = await Media.create({
        name: file.originalname,
        url: `${apiUrl}/public/uploads/gallery/${file.filename}`,
        category: req.body.category || 'General'
      });
      mediaEntries.push(newMedia);
    }

    res.status(201).json({ 
      success: true, 
      message: `${req.files.length} photos uploaded successfully`,
      data: mediaEntries 
    });
  } catch (error) {
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

    // Extract filename from URL and delete actual file
    const filename = media.url.split('/').pop();
    const filePath = path.join(__dirname, '../public/uploads/gallery', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await media.deleteOne();
    res.json({ success: true, message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMedia, addMedia, deleteMedia };
