const EmailVerificationToken = require('../models/emailVerificationToken');
const nodemailer = require('nodemailer');

const emailVerificationToken = async function (req, res, next) {
  try {
    //creates random 6 digit string
    let OTP = Math.floor(Math.random() * (1000000 - 100000)).toString();
    await EmailVerificationToken.create({
      owner: res.locals.newUser._id,
      token: OTP,
    });

    var transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    transport.sendMail({
      from: 'verification@reviewapp.com',
      to: res.locals.newUser.email,
      subject: 'Email Verification',
      html: `
            <p>Your verification OTP</p>
            <h1>${OTP}</h1>
          `,
    });
    return next();
  } catch (err) {
    return next({
      status: 500,
      message: err,
      method: 'POST',
      location: 'middlewares/emailVerificationToken',
    });
  }
};

module.exports = {
  emailVerificationToken,
};
