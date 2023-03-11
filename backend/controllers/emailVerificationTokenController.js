const EmailVerificationToken = require('../models/emailVerificationToken');
const User = require('../models/userSchema');
const { createOTP, generateMailTransporter } = require('../utils/mail');
const { isValidObjectId } = require('mongoose');

/**
 *
 * @param {HTTP request made by user} req
 * @param {Response to be sent back to user} res
 * @param {function to keep us going through the middleware chain} next
 * @returns HTTP response to user when token is successfully created and sent
 *
 * @remarks This method is used within in routes/user.js
 * @Type POST
 */

const emailVerificationToken = async function (req, res, next) {
  try {
    //creates random 6 digit string
    const OTP = createOTP();

    //Stores OTP in DB with owner id
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

/**
 *
 * @param {HTTP request made by user} req
 * @param {Response to be sent back to user} res
 * @param {function to keep us going through the middleware chain} next
 * @returns response to user when they try to verify their account with OTP
 * @remarks This method is used within in routes/user.js
 * @Type POST
 */

const verifyEmail = async (req, res, next) => {
  const { userId, OTP } = req.body;

  //Base case to make sure userId is valid MongoDB id
  if (!isValidObjectId(userId))
    return res.status(401).json({ error: 'Invalid user!' });

  try {
    //finds user/ sends res if user not found
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

/**
 *
 * @param {HTTP request made by user} req
 * @param {Response to be sent back to user} res
 * @param {function to keep us going through the middleware chain} next
 *
 * @returns New OTP token gets sent to client email returns next in our chain
 *
 * @remarks used in routes/user.js
 * @type POST
 */

const resendEmailVerificationToken = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'user not found!' });

    if (user.isVerified)
      return res.status(409).json({ error: 'This email is already verified!' });

    await EmailVerificationToken.findOneAndDelete({
      owner: user._id,
    });

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
