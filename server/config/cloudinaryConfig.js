

// cloudinary configuration file
const cloudinary = require('cloudinary').v2;

const { model } = require('mongoose');
const {CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY} = require('./envConfig.js');



cloudinary.config({ 
  cloud_name: CLOUDINARY_CLOUD_NAME, 
  api_key: CLOUDINARY_API_KEY, 
  api_secret: CLOUDINARY_API_SECRET,
});


module.exports = cloudinary;