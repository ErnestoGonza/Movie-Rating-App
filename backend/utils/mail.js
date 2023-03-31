const nodemailer = require('nodemailer');

const emailUtils = {};

/**
 * @param {optional length if OTP needs to be larger or smaller than 6 digits} otpLength
 * 
 * @returns OTP in string format
 */

emailUtils.createOTP = (otpLength = 6) => {
  let OTP = '';

  for (let i = 0; i < otpLength; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  return OTP;
};

emailUtils.generateMailTransporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

module.exports = emailUtils;
