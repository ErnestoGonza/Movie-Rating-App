const express = require('express');

require('dotenv').config();
require('./db');

const PORT = process.env.PORT || 8001;
const userRouter = require('./routes/user');

//Creates Server
const app = express();
//Turns incoming JSON to JS
app.use(express.json());

app.use('/api/user', userRouter);

app.use('*', (req, res) => {
  res.status(400).json('Page Not Found!');
});

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send({ message: err.message, method: err.method, location: err.location });
});

app.listen(PORT, () => console.log(`app is listening on Port: ${PORT}`));
