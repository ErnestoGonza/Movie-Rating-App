const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db');
require('express-async-errors');
const userRoutes = require('./routes/userRoutes');
const actorRoutes = require('./routes/actorRoutes');
const { errorHandler } = require('./middleware/errorHandler');

//Creates server
const app = express();
const PORT = 8000;

//Turns incoming JSON to JS
app.use(express.json());
//fixes cors related issues
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/actor', actorRoutes);

app.use('/*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
