const { UserNotFound } = require('../errors/UserNotFound');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
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
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors);
        res.status(400).send({ message: `Переданы некорректные данные при создании пользователя для следующих полей: ${fields.join(', ')}`});
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
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
        const field = Object.keys(err.errors)
        res.status(400).send({ message: `Переданы некорректные данные при обновлении пользователя для следующих полей: ${fields.join(', ')}`});
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный id пользователя' });
      }
      if (err instanceof UserNotFound) {
        res.status(404).send({ message: err.message });
      }
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
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
      res.status(500).send({ message: err });
    });
};
