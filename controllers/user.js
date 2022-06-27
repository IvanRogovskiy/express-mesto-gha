const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserNotFound } = require('../errors/UserNotFound');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new UserNotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof UserNotFound) {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный id пользователя' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const fields = Object.keys(err.errors);
            res.status(400).send({ message: `Переданы некорректные данные при создании пользователя для следующих полей: ${fields.join(', ')}` });
          } else {
            res.status(500).send({ message: 'Внутренняя ошибка сервера' });
          }
        });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => new UserNotFound('Пользователь с заданным id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors);
        res.status(400).send({ message: `Переданы некорректные данные при обновлении пользователя для следующих полей: ${fields.join(', ')}` });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный id пользователя' });
      }
      if (err instanceof UserNotFound) {
        res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => new UserNotFound('Пользователь с заданным id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный id пользователя' });
      }
      if (err instanceof UserNotFound) {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.getCurrentUser = (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new UserNotFound('Ошибка в получении информации о текущем пользователе');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof UserNotFound) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
        sameSite: true,
      })
        .send({ token });
    })
    .catch((err) => res.status(401).send({ message: err.message }));
};
