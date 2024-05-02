const ImageDataURI = require('image-data-uri');
const { compressImage } = require('../utils/compressImage');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

exports.uploadImage = async (req) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: 'Chatify-profiles',
  };

  try {
    const compressedImageBuffer = await compressImage(req.file.buffer);

    const mediaType = req.file.mimetype.split('/')[1].toUpperCase();

    const dataURI = ImageDataURI.encode(compressedImageBuffer, mediaType);

    const result = await cloudinary.uploader.upload(dataURI, options);

    return result;
  } catch (error) {
    console.error(error);
  }
};

exports.getAssetInfo = async (publicId) => {
  const options = {
    colors: true,
  };

  try {
    const result = await cloudinary.api.resource(publicId, options);
    return result.colors;
  } catch (error) {
    console.error(error);
  }
};

exports.destroy = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log(error);
  }
};
