const { isValidObjectId } = require('mongoose');
const EmailVerificationToken = require('../models/emailVerificationToken');
const User = require('../models/userSchema');
const { transport, sendTokenByEmail } = require('../utils/mail');

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
   * Takes in a user and creates a verification token in DB and sends Email with verificaiton token.
   */
  sendTokenByEmail(newUser);

  res.status(201).json({
    message:
      'Please verify your account. Email has been sent with 6 digit token.',
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

  const mailOtions = {
    from: 'verification@reviewapp.com',
    to: user.email,
    subject: 'Welcome Email!',
    html: `
      <p>Welcome to The Movie Review App! Your account has been verified!</p>
    `,
  };

  transport.sendMail(mailOtions, (err, info) => {
    if (err) return console.log(err);

    console.log('Message sent: ', info.messageId);
  });

  res.status(200).json({ message: 'Your email is verified!' });
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
   * Takes in a user and creates a verification token in DB and sends Email with verificaiton token.
   */
  sendTokenByEmail(user);

  res.status(201).json({
    message: 'We have resent your Authenticaiton token to your email address.',
  });
};

module.exports = {
  create,
  verifyEmail,
  resendEmailVerificationToken,
};
