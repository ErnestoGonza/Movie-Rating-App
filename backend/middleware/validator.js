const { check, validationResult } = require('express-validator');
const genres = require('../utils/genres');
const { isValidObjectId } = require('mongoose');

exports.userValidator = [
  check('name').trim().not().isEmpty().withMessage('Name is missing!'),
  check('email').normalizeEmail().isEmail().withMessage('Email is invalid!'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('password is missing!')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be 8 to 20 characters long.'),
];

exports.validatePassword = [
  check('newPassword')
    .trim()
    .not()
    .isEmpty()
    .withMessage('password is missing!')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be 8 to 20 characters long.'),
];

exports.signInValidator = [
  check('email').normalizeEmail().isEmail().withMessage('Email is invalid!'),
  check('password').trim().not().isEmpty().withMessage('password is missing!'),
];

exports.actorInfoValidator = [
  check('name').trim().not().isEmpty().withMessage('Name is missing!'),
  check('about').trim().not().isEmpty().withMessage('About is required!'),
  check('gender').trim().not().isEmpty().withMessage('Gender is required!'),
];

exports.validateMovie = [
  check('title').trim().not().isEmpty().withMessage('Movie title is missing!'),
  check('storyLine')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Story line is missing!'),
  check('language').trim().not().isEmpty().withMessage('language is missing!'),
  check('releaseDate').isDate().withMessage('Release date is missing!'),
  check('status')
    .isIn(['public', 'private'])
    .withMessage('Movie title is missing!'),
  check('type').trim().not().isEmpty().withMessage('Movie type is missing!'),
  check('genres')
    .isArray()
    .withMessage('Genre must be an array of strings!')
    .custom((val) => {
      for (let g of val) {
        if (!genres.includes(g)) throw Error('Invalid genre!');
      }

      return true;
    }),
  check('tags')
    .isArray({ min: 1 })
    .withMessage('Tags must be an array of strings!')
    .custom((tags) => {
      for (let tag of tags) {
        if (typeof tag !== 'string') throw Error('Invalid tag!');
      }

      return true;
    }),
  check('cast')
    .isArray()
    .withMessage('Cast must be an array of objects!')
    .custom((cast) => {
      for (let c of cast) {
        if (!isValidObjectId(c.id)) throw Error('Invalid cast id inside cast!');
        if (!c.roleAs?.trim()) throw Error('Role is missing inside cast!');
        if (typeof c.leadActor !== 'boolean')
          throw Error('Role is missing inside cast!');
      }

      return true;
    }),
  check('trailerInfo')
    .isObject()
    .withMessage('trailerInfo must be an object with url and public_id')
    .custom(({ url, public_id }) => {
      try {
        const result = new URL(url);
        if (!result.protocol.includes('http'))
          throw Error('Trailer url is invalid!');

        const arr = url.split('/');
        const publicId = arr[arr.length - 1].split('.')[0];

        if (publicId !== public_id) throw Error('Trailer url is invalid!');
      } catch (error) {
        throw Error('Trailer url is invalid!');
      }

      return true;
    }),
  check('poster').custom((_, { req }) => {
    if (!req.file) throw Error('Poster is missing!');

    return true;
  }),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();

  if (error.length) {
    return res.status(401).json({ error: error[0].msg });
  }

  next();
};
