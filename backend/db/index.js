const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb+srv://TheRaftMaker:cvIDRBvAk0XQKZBl@cluster0.dj98x50.mongodb.net/review-app?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('db is connected!');
  })
  .catch((err) => {
    console.log('db connection failed: ', err);
  });
