const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

exports.isAuth = async (req, res, next) => {
  const token = req.headers?.authorization;

  const jwtToken = token.split('Bearer ')[1];

  const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const { userId } = decode;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found!' });

  req.user = user;
  next();
};
