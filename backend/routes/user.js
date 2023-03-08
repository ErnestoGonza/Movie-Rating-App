const express = require('express');
const userController = require('../controllers/userController');
const { userValidator, validate } = require('../middlewares/validator')

const router = express.Router();

router.post('/create',
  userValidator,
  validate, 
  userController.createUser, 
  (req, res) => {
  res.status(201).json(res.locals.newUser);
});

router.post('/sign-in', userController.signIn, (req, res) => {
  res.status(200).json('Signed in!') //Needs middleware to check email and pass
})

module.exports = router;
