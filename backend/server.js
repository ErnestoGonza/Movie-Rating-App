const express = require('express');
const PORT = 8000;

const app = express();

app.get('/', (req, res) => {
  res.status(200).send("<h1>You've made it kid!</h1>");
});

app.listen(PORT, () => console.log(`app is listening on Port: ${PORT}`));
