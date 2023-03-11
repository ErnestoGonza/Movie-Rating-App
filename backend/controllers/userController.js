const User = require('../models/userSchema');

const userController = {};

userController.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser)
      return res.status(409).json({ error: 'this email is already in use!' });

    const newUser = await User.create({ name, email, password });
    res.locals.newUser = newUser;
    return next();
  } catch (err) {
    return next({
      status: 500,
      message: err,
      method: 'POST',
      location: 'UserController.createUser',
    });
  }
};

userController.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    const comparePassword = await existingEmail.comparePassword(password);

    if (!email || !existingEmail)
      return res.status(401).json({ error: 'Invalid email!' });
    if (!password || !comparePassword)
      return res.status(401).json({ error: 'Invalid password!' });

    return next();
  } catch (err) {
    return next({
      status: 500,
      message: err,
      method: 'POST',
      location: 'UserController.signIn',
    });
  }
};

module.exports = userController;
