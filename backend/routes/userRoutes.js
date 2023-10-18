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
const { isAuth } = require('../middleware/auth');

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

router.get('/is-auth', isAuth, (req, res) => {
  const { user } = req;

  res
    .status(200)
    .json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
});

module.exports = router;
