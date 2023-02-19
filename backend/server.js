const express = require('express');

require('dotenv').config();
require('./db');

const PORT = process.env.PORT || 8001;
const userRouter = require('./routes/user');

const app = express();
app.use(express.json());

app.use('/api/user', userRouter);

app.listen(PORT, () => console.log(`app is listening on Port: ${PORT}`));
