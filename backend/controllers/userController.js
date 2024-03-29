const { isValidObjectId } = require('mongoose');
const EmailVerificationToken = require('../models/emailVerificationToken');
const PasswordResetToken = require('../models/passwordResetToken');
const User = require('../models/userSchema');
const { transport, sendTokenByEmail } = require('../utils/mail');
const { generateRandomByte } = require('../utils/helper');
const jwt = require('jsonwebtoken');

const create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser)
    return res.status(409).json({ error: 'Email is already in use!' });

  const newUser = new User({ name, email, password });
  await newUser.save();

  const oldToken = await User.findOne({ owner: newUser._id });
  if (oldToken)
    return res
      .status(409)
      .json({ error: 'A token has already been sent to your email!' });

  /**
   * Takes in a user and sends Email with verificaiton token. returns OTP code
   */
  const OTP = await sendTokenByEmail(newUser);

  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: newUser.token,
      isVerified: newUser.isVerfied,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId))
    return res.status(404).json({ error: 'Invalid user!' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'Invalid user!' });

  if (user.isVerfied)
    return res.status(409).json({ error: 'User is already verified!' });

  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) res.status(401).json({ error: 'Token not found!' });

  const isMatched = await token.compareToken(OTP);
  if (!isMatched)
    return res.status(401).json({ error: 'Please submit a valid token!' });

  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);

  const mailOptions = {
    from: 'verification@reviewapp.com',
    to: user.email,
    subject: 'Welcome Email!',
    html: `
      <p>Welcome to The Movie Review App! Your account has been verified!</p>
    `,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return console.log(err);

    console.log('Message sent: ', info.messageId);
  });

  const { _id, name, email, isVerified, role } = user;

  const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);

  res.status(200).json({
    user: { _id, name, email, token: jwtToken, isVerified, role },
    message: 'Your email is verified!',
  });
};

const resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found!' });

  if (user.isVerified)
    return res.status(409).json({ error: 'Email is already verified.' });

  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  /**
   * Takes in a user and sends Email with verificaiton token. returns OTP code
   */
  const OTP = await sendTokenByEmail(user);

  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  res.status(201).json({
    message: 'We have resent your Authenticaiton token to your email address.',
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(409).json({ error: 'Email is missing!' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found!' });

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  const token = await generateRandomByte();
  const newPasswordResetToken = await PasswordResetToken({
    owner: user._id,
    token,
  });
  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

  const mailOptions = {
    from: 'security@reviewapp.com',
    to: user.email,
    subject: 'Password Reset Link',
    html: `
      <p>Click the link below to change your password.</p>
      <a href='${resetPasswordUrl}'>Change Password</a>
    `,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return console.log(err);

    console.log('Message sent: ', info.messageId);
  });

  res.status(200).json({ message: 'Link sent to your email!' });
};

const sendResetPasswordTokenStatus = (req, res) => {
  res.status(200).json({ valid: true });
};

const resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  const user = await User.findById(userId);
  const matched = await user.comparePassword(newPassword);

  if (matched)
    return res.status(409).json({
      error: 'New password must be different from the old password.',
    });

  user.password = newPassword;

  await user.save();
  await PasswordResetToken.findByIdAndDelete(req.resetToken._id);

  const mailOptions = {
    from: 'security@reviewapp.com',
    to: user.email,
    subject: 'Password Reset Successfully',
    html: `
      <p>Congratulations, you've reset your password successfully!</p>
    `,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return console.log(err);

    console.log('Message sent: ', info.messageId);
  });

  res.status(200).json({ message: 'Password reset successfully!' });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Email/Password mismatch!' });

  const matched = await user.comparePassword(password);
  if (!matched)
    return res.status(401).json({ error: 'Email/Password mismatch!' });

  const { _id, name, isVerified, role } = user;

  const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);

  res
    .status(200)
    .json({
      user: { id: _id, name, email, role, token: jwtToken, isVerified },
    });
};

module.exports = {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgotPassword,
  sendResetPasswordTokenStatus,
  resetPassword,
  signIn,
};
