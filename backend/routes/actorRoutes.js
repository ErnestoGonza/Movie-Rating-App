const express = require('express');
const {
  createActor,
  updateActor,
  removeActor,
  searchActor,
  getLatestActors,
  getSingleActor,
} = require('../controllers/actorController');
const { uploadImage } = require('../middleware/multer');
const { actorInfoValidator, validate } = require('../middleware/validator');
const router = express.Router();

router.post(
  '/create',
  uploadImage.single('avatar'),
  actorInfoValidator,
  validate,
  createActor
);
router.post(
  '/update/:id',
  uploadImage.single('avatar'),
  actorInfoValidator,
  validate,
  updateActor
);

router.delete('/:id', removeActor);

router.get('/search', searchActor);
router.get('/latest-uploads', getLatestActors);
router.get('/single/:id', getSingleActor);

module.exports = router;
