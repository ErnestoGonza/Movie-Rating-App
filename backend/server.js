const express = require('express');
const PORT = 8000;
const userRouter = require('./routes/user');

const app = express();
app.use(express.json());

app.use('/api/user', userRouter);

app.listen(PORT, () => console.log(`app is listening on Port: ${PORT}`));
