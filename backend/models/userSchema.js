const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

/**
 * @remarks every time our db saves new information we check if password was modified. If it's true then we encrypt our password for security.
 * 
 * @return the next funciton in our middleware chain.
 */
userSchema.pre('save', async function (next) {
  if (this.isModified('password'))
    this.password = await bcrypt.hash(this.password, 10);

  return next();
});

/**
 * @param {Takes in the user provided password and compares it to the hashed password. } password 
 * 
 * @returns Should return true if they match or false if the incorrect password was proivded
 */
userSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

module.exports = mongoose.model('User', userSchema);
