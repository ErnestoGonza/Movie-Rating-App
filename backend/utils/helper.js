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

//------------Cloudinary-START-----------------------------------------------------

const uploadFileToCloud = async (file, fileType = 'image') => {
  const options = {
    image: {
      gravity: 'face',
      height: 500,
      width: 500,
      crop: 'thumb',
    },
    video: {
      resource_type: 'video',
    },
    poster: {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    },
  };

  const cloudRes = await cloudinary.uploader.upload(
    file.path,
    options[fileType]
  );

  return {
    url: cloudRes.secure_url,
    public_id: cloudRes.public_id,
    responsive_breakpoints: cloudRes?.responsive_breakpoints,
  };
};

const destroyImageFromCloud = async (public_id) => {
  const result = await cloudinary.uploader.destroy(public_id);

  return result;
};

//------------Cloudinary-END--------------------------------------------------

const formatActor = (actor) => {
  const { name, gender, about, _id, avatar } = actor;

  return {
    id: _id,
    name,
    about,
    gender,
    avatar: avatar?.url,
  };
};

const parseData = (req, res, next) => {
  const { trailer, cast, genres, tags, writers } = req.body;

  if (trailer) req.body.trailer = JSON.parse(trailer);
  if (cast) req.body.cast = JSON.parse(cast);
  if (genres) req.body.genres = JSON.parse(genres);
  if (tags) req.body.tags = JSON.parse(tags);
  if (writers) req.body.writers = JSON.parse(writers);

  next();
};

module.exports = {
  generateRandomByte,
  uploadFileToCloud,
  destroyImageFromCloud,
  formatActor,
  parseData,
};
