const express = require('express');
const { create } = require('../controllers/userController');
const { userValidator, validate } = require('../middleware/validator');

const router = express.Router();

router.post('/create', userValidator, validate, create);

module.exports = router;
