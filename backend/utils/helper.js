const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) return reject(err);
      const buffString = buff.toString('hex');

      resolve(buffString);
    });
  });
};

const uploadImageToCloud = async (file) => {
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      gravity: 'face',
      height: 500,
      width: 500,
      crop: 'thumb',
    }
  );

  return { url: secure_url, public_id };
};

const destroyImageFromCloud = async (public_id) => {
  const result = await cloudinary.uploader.destroy(public_id);

  return result;
};

module.exports = {
  generateRandomByte,
  uploadImageToCloud,
  destroyImageFromCloud,
};
