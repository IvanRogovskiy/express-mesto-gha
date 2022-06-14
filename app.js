const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '62a712f6c89dab660e0fba56',
  };
  next();
});

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));
app.use('/*', (req, res) => {
  res.send({message: 'Неверный путь'})
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
