const User = require('../models/userSchema');

const userController = {};

userController.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
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

module.exports = userController;
