require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/user');
const errorHandler = require('./middlewares/errorHandler');
const { validateCreateUser, validateLogin } = require('./middlewares/validation');
const { NotFoundError } = require('./errors/NotFoundError');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', [validateLogin], login);
app.post('/signup', [validateCreateUser], createUser);

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('/*', () => {
  throw new NotFoundError('Неверный путь', 'PathNotFoundError');
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(BASE_PATH);
});
