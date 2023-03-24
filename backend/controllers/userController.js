const User = require('../models/userSchema');
const PasswordResetToken = require('../models/passwordResetToken');
const { generateRandomByte } = require('../utils/helper');
const { generateMailTransporter } = require('../utils/mail');

const userController = {};

/**
 *
 * @param {HTTP request made by user} req
 * @param {Response to be sent back to user} res
 * @param {function to keep us going through the middleware chain} next
 * @returns next function in our middleware chain
 *
 * @remarks used in routes/user.js
 * @type POST
 */

userController.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) throw { errMsg: 'This email is already in use!', status: 409 };

    const newUser = await User.create({ name, email, password });
    res.locals.newUser = newUser;
    return next();
  } catch (err) {
    return next({
      status: err.status || 500,
      message: err.errMsg || err,
      method: 'POST',
      location: 'UserController.createUser',
    });
  }
};

/**
 *
 * @param {HTTP request made by user} req
 * @param {Response to be sent back to user} res
 * @param {function to keep us going through the middleware chain} next
 * @returns next function in our middleware chain
 *
 * @remarks used in routes/user.js
 * @type POST
 */

userController.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    const comparePassword = await existingEmail.comparePassword(password);

    if (!email || !existingEmail)
      throw { errMsg: 'Invalid email!', status: 401 };
    if (!password || !comparePassword)
      throw { errMsg: 'Invalid Password!', status: 401 };

    return next();
  } catch (err) {
    return next({
      status: err.status || 500,
      message: err.errMsg || err,
      method: 'POST',
      location: 'UserController.signIn',
    });
  }
};

userController.resetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) throw { errMsg: 'Email is required.', status: 401 };
    const user = await User.findOne({ email });
    if (!user) throw { errMsg: 'User not found!', status: 401 };

    await PasswordResetToken.findOneAndDelete({ owner: user._id });

    const token = await generateRandomByte();
    await PasswordResetToken.create({
      owner: user._id,
      token,
    });

    const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`;

    generateMailTransporter.sendMail({
      from: 'security@reviewapp.com',
      to: user.email,
      subject: 'Reset Password Link',
      html: `
                <p>Click <a href=${resetPasswordUrl}>here</a> to reset password.</p>
              `,
    });

    return next();
  } catch (err) {
    return next({
      status: err.status || 500,
      message: err.errMsg || err,
      method: 'POST',
      location: 'UserController.resetPassword',
    });
  }
};

module.exports = userController;
