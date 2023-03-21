const express = require('express');
const userController = require('../controllers/userController');
const { userValidator, validate } = require('../middlewares/validator');
const {
  emailVerificationToken,
  verifyEmail,
  resendEmailVerificationToken,
} = require('../controllers/emailVerificationTokenController');

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

router.post('/verify-email', verifyEmail, (req, res) => {
  res.status(201).json({ message: 'Your email is verified.' });
});

router.post(
  '/resend-email-verification-token',
  resendEmailVerificationToken,
  (req, res) => {
    res
      .status(201)
      .json({ message: 'Your new token has been sent to your email.' });
  }
);

router.post('/sign-in', userController.signIn, (req, res) => {
  res.status(200).json('Signed in!');
});

router.post('/reset-password', userController.resetPassword, (req, res) => {
  res
    .status(200)
    .json({ message: 'Your reset token has been sent to your email.' });
});

module.exports = router;
