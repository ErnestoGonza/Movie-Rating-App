const PasswordResetToken = require('../models/passwordResetToken');
const { isValidObjectId } = require('mongoose');

const userMiddleware = {};

userMiddleware.isValidPassResetToken = async (req, res, next) => {
  const { token, userId } = req.body;

  try {
    if (!isValidObjectId(userId) || !token.trim())
      throw { errMsg: 'Invalid user or token!', status: 401 };

    const passToken = await PasswordResetToken.findOne({ owner: userId });
    if (!passToken)
      throw {
        errMsg: "Password reset token expired or doesn't exist",
        status: 401,
      };

    const isMatched = await PasswordResetToken.compareToken(token);
    if (!isMatched)
      throw { errMsg: 'Please submit a valid token!', status: 401 };

    req.passToken = passToken;

    return next();
  } catch (err) {
    return next({
      status: err.status || 500,
      message: err.errMsg || err,
      method: 'POST',
      location: 'userMiddleware.isValidPassResetToken',
    });
  }
};

module.exports = userMiddleware;
