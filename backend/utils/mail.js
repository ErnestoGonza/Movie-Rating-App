const nodemailer = require('nodemailer');
const EmailVerificationToken = require('../models/emailVerificationToken');

const generateOTP = (otpLength = 6) => {
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += Math.floor(Math.random() * 10);
  }
  return OTP;
};

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '627b994359d10a',
    pass: '8b41678c1681de',
  },
});

const sendTokenByEmail = async (user) => {
  //Generate OTP
  const OTP = generateOTP(6);

  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  const mailOtions = {
    from: 'verification@reviewapp.com',
    to: user.email,
    subject: 'Verification Token - Movie Review App',
    html: `
      <p>Your verificaiton OTP</p>
      <h1>${OTP}</h1>
    `,
  };

  transport.sendMail(mailOtions, (err, info) => {
    if (err) return console.log(err);

    console.log('Message sent: ', info.messageId);
  });
};

module.exports = {
  generateOTP,
  transport,
  sendTokenByEmail,
};
