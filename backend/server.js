const express = require('express');
require('dotenv').config();
require('./db');
require('express-async-errors');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorHandler');
//Creates server
const app = express();
const PORT = 8000;

//Turns incoming JSON to JS
app.use(express.json());

app.use('/api/user', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
