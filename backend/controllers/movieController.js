const { uploadFileToCloud } = require('../utils/helper');
const Movie = require('../models/movieSchema');
const { isValidObjectId } = require('mongoose');

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
    trailer,
    language,
  } = body;

  const newMovie = new Movie({
    title,
    storyLine,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    trailer,
    language,
  });

  if (director) {
    if (!isValidObjectId(director))
      return res.status(409).json({ error: 'Invalid director id!' });

    newMovie.director = director;
  }

  if (writers) {
    for (let id of writers) {
      if (!isValidObjectId(id))
        return res.status(409).json({ error: 'Invalid writer id!' });
    }
    newMovie.writers = writers;
  }

  // uploading poster
  const { url, public_id, responsive_breakpoints } = await uploadFileToCloud(
    file,
    'poster'
  );

  const poster = { url, public_id, responsive: [] };

  const { breakpoints } = responsive_breakpoints[0];
  if (breakpoints.length)
    for (let img of breakpoints) poster.responsive.push(img.secure_url);

  newMovie.poster = poster;

  await newMovie.save();

  res.status(201).json({
    id: newMovie._id,
    title,
  });
};
