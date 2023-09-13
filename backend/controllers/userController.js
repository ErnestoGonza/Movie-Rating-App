const create = (req, res) => {
  res.status(200).json({ user: req.body });
};

module.exports = {
  create,
};