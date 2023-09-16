const { isValidObjectId } = require('mongoose');
const PasswordResetToken = require('../models/passwordResetToken');

const isValidPassResetToken = async (req, res, next) => {
  const { token, userId } = req.body;

  if (!token.trim() || !isValidObjectId(userId))
    return res.status(401).json({ message: 'Invalid user or token provided.' });

  let resetToken;

  try {
    resetToken = await PasswordResetToken.findOne({ owner: userId });
    if (!resetToken)
      return res.status(409).json({ message: 'Token not found!' });

    const matched = await resetToken.compareToken(token);
    if (!matched) return res.status(401).json({ message: 'Invalid token!' });
  } catch (err) {
    console.log('Error: ', err);
  }

  req.resetToken = resetToken;
  next();
};

module.exports = {
  isValidPassResetToken,
};
