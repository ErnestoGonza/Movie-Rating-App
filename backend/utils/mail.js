const emailUtils = {};

emailUtils.createOTP = (otpLength = 6) => {
  let OTP = '';

  for (let i = 0; i < otpLength; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  return OTP;
};

module.exports = emailUtils;
