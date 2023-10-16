const express = require('express');
const { isAuth, isAdmin } = require('../middleware/auth');
const { uploadVideo, uploadImage } = require('../middleware/multer');
const {
  uploadTrailer,
  createMovie,
} = require('../controllers/movieController');
const { validateMovie, validate } = require('../middleware/validator');
const { parseData } = require('../utils/helper');

const router = express.Router();

router.post(
  '/upload-trailer',
  isAuth,
  isAdmin,
  uploadVideo.single('trailer'),
  uploadTrailer
);
router.post(
  '/create',
  isAuth,
  isAdmin,
  uploadImage.single('poster'),
  parseData,
  // validateMovie,
  // validate,
  createMovie
);

module.exports = router;
