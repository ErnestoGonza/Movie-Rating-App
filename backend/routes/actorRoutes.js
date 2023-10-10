const express = require('express');
const { createActor } = require('../controllers/actorController');
const { uploadImage } = require('../middleware/multer');
const router = express.Router();

router.post('/create', uploadImage.single('avatar'), createActor);

module.exports = router;
