const express = require('express');
const userRoutes = require('./routes/userRoutes');
// Simply initiates the db in our main server file, index.js is picked by default.
require('./db');

//Creates server
const app = express();

//Turns incoming JSON to JS
app.use(express.json());

const PORT = 8000;

app.use('/api/user', userRoutes);

app.get('/about', (req, res) => {
  res.status(200).send('<h1>Hello from About</h1>');
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
