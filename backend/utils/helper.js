const crypto = require('crypto');

const generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) return reject(err);
      const buffString = buff.toString('hex');

      resolve(buffString);
    });
  });
};

module.exports = {
  generateRandomByte,
};
