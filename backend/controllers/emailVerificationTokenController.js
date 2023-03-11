const EmailVerificationToken = require('../models/emailVerificationToken');
const User = require('../models/userSchema');
const { createOTP, generateMailTransporter } = require('../utils/mail');
const { isValidObjectId } = require('mongoose');

const emailVerificationToken = async function (req, res, next) {
  try {
    //creates random 6 digit string
    const OTP = createOTP();

    await EmailVerificationToken.create({
      owner: res.locals.newUser._id,
      token: OTP,
    });

    generateMailTransporter.sendMail({
      from: 'verification@reviewapp.com',
      to: res.locals.newUser.email,
      subject: 'Email Verification',
      html: `
            <p>Your verification OTP</p>
            <h1>${OTP}</h1>
          `,
    });

    res.locals.OTP = OTP;
    return next();
  } catch (err) {
    return next({
      status: 500,
      message: err,
      method: 'POST',
      location:
        'controllers/emailVerificationTokenController/emailVerificationToken',
    });
  }
};

const verifyEmail = async (req, res, next) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId))
    return res.status(401).json({ error: 'Invalid user!' });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'user not found!' });

    if (user.isVerified)
      return res.status(409).json({ error: 'user is alerady verified' });

    const token = await EmailVerificationToken.findOne({ owner: userId });
    if (!token)
      return res.status(401).json({ error: 'token expired or was not found!' });

    const isMatched = await token.compareToken(OTP);
    if (!isMatched)
      return res.status(401).json({ error: 'Please submit a valid OTP!' });

    user.isVerified = true;
    await user.save();

    EmailVerificationToken.findByIdAndDelete(token._id);

    generateMailTransporter.sendMail({
      from: 'verification@reviewapp.com',
      to: user.email,
      subject: 'Welcome Email',
      html: `
              <h1>Welcome to our app ${user.name}! Thank you for choosing us.</h1>
            `,
    });

    return next();
  } catch (err) {
    return next({
      status: 500,
      message: err,
      method: 'POST',
      location: 'controllers/emailVerificationTokenController/verifyEmail',
    });
  }
};

const resendEmailVerificationToken = async (req, res, next) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ error: 'user not found!' });

  if (user.isVerified)
    return res.status(409).json({ error: 'This email is already verified!' });

  await EmailVerificationToken.findOneAndDelete({
    owner: user._id,
  });

  try {
    //creates random 6 digit string
    const OTP = createOTP();

    await EmailVerificationToken.create({
      owner: user._id,
      token: OTP,
    });

    generateMailTransporter.sendMail({
      from: 'verification@reviewapp.com',
      to: user.email,
      subject: 'Email Verification',
      html: `
              <p>Your new verification OTP</p>
              <h1>${OTP}</h1>
            `,
    });

    return next();
  } catch (err) {
    return next({
      status: 500,
      message: err,
      method: 'POST',
      location:
        'controllers/emailVerificationTokenControllers/resendEmailverificationToken',
    });
  }
};

module.exports = {
  emailVerificationToken,
  verifyEmail,
  resendEmailVerificationToken,
};
