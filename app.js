require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/user');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Неверный путь' });
});

app.listen(PORT, () => {
  console.log(BASE_PATH);
});
