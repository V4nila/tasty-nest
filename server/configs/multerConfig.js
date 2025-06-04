const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'recipes', 
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const parser = multer({ storage: storage });

module.exports = parser;
