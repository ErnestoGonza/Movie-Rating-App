const mongoose = require('mongoose');

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('DB is Connected!'))
  .catch((err) => console.log('ERROR IN DB: ', err));
