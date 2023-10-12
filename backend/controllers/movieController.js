const { uploadFileToCloud } = require('../utils/helper');

exports.uploadTrailer = async (req, res) => {
  const { file } = req;
  if (!file) return res.status(401).json({ error: 'Video file is missing!' });

  const videoRes = await uploadFileToCloud(file, 'video');

  res.status(201).json(videoRes);
};

exports.createMovie = async (req, res) => {
  const { file, body } = req;
  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    poster,
    trailer,
    language,
  } = body;
};
