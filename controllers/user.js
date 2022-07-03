const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CastError } = require('../errors/CastError');
const { ValidationError } = require('../errors/ValidationError');
const User = require('../models/user');
const { UserAlreadyExists } = require('../errors/UserAlreadyExists');
const { NotFoundError } = require('../errors/NotFoundError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден', 'UserNotFoundError');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Передан некорректный id карточки при удалении карточки'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => res.send({
          data: {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          },
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const fields = Object.keys(err.errors);
            return next(new ValidationError(`Переданы некорректные данные при создании карточки для следующих полей: ${fields.join(', ')}`));
          }
          if (err.code === 11000) {
            next(new UserAlreadyExists('Пользователь с данным email уже существует'));
          } else {
            next(err);
          }
        });
    });
};

module.exports.updateUserInfo = (req, res, next) => {
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
    .orFail(() => {
      throw new NotFoundError('Пользователь с заданным id не найден', 'UserNotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors);
        return next(new ValidationError(`Переданы некорректные данные при создании карточки для следующих полей: ${fields.join(', ')}`));
      }
      if (err.name === 'CastError') {
        return next(new CastError('Некорректный id пользователя'));
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
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
    .orFail(() => new NotFoundError('Пользователь с заданным id не найден', 'UserNotFoundError'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
      }
      if (err.name === 'CastError') {
        return next(new CastError('Некорректный id пользователя'));
      }
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Ошибка в получении информации о текущем пользователе', 'UserNotFoundError');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
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
    .catch(next);
};
