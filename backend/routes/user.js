const express = require('express');
const userController = require('../controllers/userController');
const { userValidator, validate } = require('../middlewares/validator');
const {
  emailVerificationToken,
} = require('../middlewares/emailVerificationToken');

const router = express.Router();

router.post(
  '/create',
  userValidator,
  validate,
  userController.createUser,
  emailVerificationToken,
  (req, res) => {
    res.status(201).json({
      newUser: res.locals.newUser,
      emailVerificationToken:
        'Please Verify your email. OTP has been sent to your email address!',
    });
  }
);

router.post('/sign-in', userController.signIn, (req, res) => {
  res.status(200).json('Signed in!'); //Needs middleware to check email and pass
});

module.exports = router;
