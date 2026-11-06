const cloudinary = require('cloudinary').v2;

// Supports either a single CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud_name>
// (the SDK reads it automatically) or the three separate variables below.
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
} else {
  cloudinary.config({ secure: true });
}

// Cloudinary Media Library folder (Media Library > Assets)
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'assets';

const uploadBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: CLOUDINARY_FOLDER, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

module.exports = { cloudinary, uploadBuffer, CLOUDINARY_FOLDER };
