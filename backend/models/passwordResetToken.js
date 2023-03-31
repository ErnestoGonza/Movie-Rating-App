const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const passwordResetTokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

/**
 * @remarks every time our db saves new information we check if token was modified. If it's true then we encrypt our token for security.
 *
 * @return the next funciton in our middleware chain.
 */
passwordResetTokenSchema.pre('save', async function (next) {
  if (this.isModified('token')) this.token = await bcrypt.hash(this.token, 10);

  return next();
});

/**
 *
 * @param {Takes in the user provided token and compares it to the hashed token. } token
 * @returns Should return true if they match or false if the incorrect token was proivded
 */
passwordResetTokenSchema.methods.compareToken = async function (token) {
  const result = await bcrypt.compare(token, this.token);
  return result;
};

module.exports = mongoose.model(
  'passwordResetTokenSchema',
  passwordResetTokenSchema
);
