const { uploadFileToCloud, destroyImageFromCloud } = require('../utils/helper');
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

exports.updateMovieWithoutPoster = async (req, res) => {
  const { movieId } = req.params;
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
  } = req.body;

  if (!isValidObjectId(movieId))
    return res.status(409).json({ error: 'Invalid Movie ID!' });

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(404).json({ error: 'Movie not found!' });

  if (director) {
    if (!isValidObjectId(director))
      return res.status(409).json({ error: 'Invalid director id!' });

    movie.director = director;
  }

  if (writers) {
    for (let id of writers) {
      if (!isValidObjectId(id))
        return res.status(409).json({ error: 'Invalid writer id!' });
    }
    movie.writers = writers;
  }

  movie.title = title;
  movie.storyLine = storyLine;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  await movie.save();
  res.status(200).json({ message: 'Movie is updated!', movie });
};

exports.updateMovieWithPoster = async (req, res) => {
  const { movieId } = req.params;
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
  } = req.body;

  if (!isValidObjectId(movieId))
    return res.status(409).json({ error: 'Invalid Movie ID!' });

  if (!req.file)
    return res.status(401).json({ error: 'Movie poster is missing!' });

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(404).json({ error: 'Movie not found!' });

  if (director) {
    if (!isValidObjectId(director))
      return res.status(409).json({ error: 'Invalid director id!' });

    movie.director = director;
  }

  if (writers) {
    for (let id of writers) {
      if (!isValidObjectId(id))
        return res.status(409).json({ error: 'Invalid writer id!' });
    }
    movie.writers = writers;
  }

  movie.title = title;
  movie.storyLine = storyLine;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  const posterId = movie.poster?.public_id;
  if (posterId) {
    const { result } = await destroyImageFromCloud(posterId);
    if (result !== 'ok') {
      return res
        .status(409)
        .json({ error: 'Could not update poster at the moment!' });
    }
  }

  const { url, public_id, responsive_breakpoints } = await uploadFileToCloud(
    req.file,
    'poster'
  );

  const poster = { url, public_id, responsive: [] };

  const { breakpoints } = responsive_breakpoints[0];
  if (breakpoints.length)
    for (let img of breakpoints) poster.responsive.push(img.secure_url);

  movie.poster = poster;

  await movie.save();
  res.status(200).json({ message: 'Movie is updated!', movie });
};

exports.removeMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId))
    return res.status(409).json({ error: 'Invalid Movie ID!' });

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(404).json({ error: 'Movie not found!' });

  const posterId = movie.poster?.public_id;
  if (posterId) {
    const { result } = await destroyImageFromCloud(posterId);

    if (result !== 'ok') {
      return res
        .status(409)
        .json({ error: 'Could not remove poster from cloud!' });
    }
  }

  const trailerId = movie.trailer?.public_id;
  if (!trailerId)
    return res.status(401).json({ error: 'Could not find trailer in cloud!' });

  const { result } = await destroyImageFromCloud(trailerId, {
    resource_type: 'video',
  });
  if (result !== 'ok') {
    return res
      .status(409)
      .json({ error: 'Could not remove trailer from cloud!' });
  }

  await Movie.findByIdAndDelete(movieId);
  res.status(200).json({ message: 'Movie deleted successfully!' });
};
