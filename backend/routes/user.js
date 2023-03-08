const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/create', userController.createUser, (req, res) => {
  res.status(201).json(res.locals.newUser);
});

module.exports = router;
