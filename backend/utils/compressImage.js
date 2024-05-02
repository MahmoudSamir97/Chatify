const sharp = require('sharp');

exports.compressImage = async (imagePath) => {
  try {
    const resizedImageBuffer = await sharp(imagePath)
      .resize({ width: 1000 })
      .jpeg({ quality: 80 })
      .toBuffer();

    return resizedImageBuffer;
  } catch (error) {
    console.error('Error compressing image:', error);

    throw error;
  }
};
