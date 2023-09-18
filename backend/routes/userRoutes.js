const express = require('express');
const {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgotPassword,
  sendResetPasswordTokenStatus,
  resetPassword,
  signIn,
} = require('../controllers/userController');
const {
  userValidator,
  validate,
  validatePassword,
  signInValidator,
} = require('../middleware/validator');
const { isValidPassResetToken } = require('../middleware/user');

const router = express.Router();

router.post('/create', userValidator, validate, create);
router.post('/sign-in', signInValidator, validate, signIn);
router.post('/verify-email', verifyEmail);
router.post('/resend-email-verification', resendEmailVerificationToken);
router.post('/forgot-password', forgotPassword);
router.post(
  '/verify-password-reset-token',
  isValidPassResetToken,
  sendResetPasswordTokenStatus
);
router.post(
  '/reset-password',
  validatePassword,
  validate,
  isValidPassResetToken,
  resetPassword
);

module.exports = router;
