const User = require('../models/userSchema');

const create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser)
    return res.status(409).json({ error: 'Email is already in use!' });

  const newUser = new User({ name, email, password });
  await newUser.save();

  res.status(201).json({ user: newUser });
};

module.exports = {
  create,
};
