const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createStorage = (folderName) => new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: `pikeytravels/${folderName}`,
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

const upload = (folderName) => multer({ storage: createStorage(folderName) });

module.exports = { cloudinary, upload, createStorage };