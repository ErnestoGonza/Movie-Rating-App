const emailUtils = {};

emailUtils.createOTP = () => {
  return Math.floor(Math.random() * (1000000 - 100000)).toString();
};

module.exports = emailUtils;
