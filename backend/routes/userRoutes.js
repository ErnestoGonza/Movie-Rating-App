const express = require('express');
const {
  create,
  verifyEmail,
  resendEmailVerificationToken,
} = require('../controllers/userController');
const { userValidator, validate } = require('../middleware/validator');

const router = express.Router();

router.post('/create', userValidator, validate, create);
router.post('/verify-email', verifyEmail);
router.post('/resend-email-verification', resendEmailVerificationToken);

module.exports = router;
