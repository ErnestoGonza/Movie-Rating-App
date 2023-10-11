const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

exports.isAuth = async (req, res, next) => {
  const token = req.headers?.authorization;
  if(!token) return res.status(401).json({ error: 'No authorization token!' })

  const jwtToken = token.split('Bearer ')[1];

  const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const { userId } = decode;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found!' });

  req.user = user;
  next();
};

exports.isAdmin = async (req, res, next) => {
  const { user } = req;

  if (user.role !== 'admin')
    return res.status(401).json({ error: 'Unauthorized access!' });

  next();
};
