const nodemailer = require('nodemailer');

const generateOTP = (otpLength = 6) => {
  let OTP = '';
  for (let i = 0; i < otpLength; i++) {
    OTP += Math.floor(Math.random() * 10);
  }
  return OTP;
};

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAIL_TRAP_USER,
    pass: process.env.MAIL_TRAP_PASS,
  },
});

const sendTokenByEmail = async (user) => {
  //Generate OTP
  const OTP = generateOTP(6);

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

  return OTP;
};

module.exports = {
  generateOTP,
  transport,
  sendTokenByEmail,
};
