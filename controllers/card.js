const { CardNotFound } = require('../errors/CardNotFound');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;
  const owner = req.user._id;
  Card.create({
    name, link, owner,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors);
        res.status(400).send({ message: `Переданы некорректные данные при создании карточки для следующих полей: ${fields.join(', ')}`});
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => new CardNotFound('Карточка с указанным _id не найдена.'))
    .then(() => res.send({ message: 'Пост удален'}))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный id карточки при удалении карточки' })
      }
      if (err instanceof CardNotFound) {
        return res.status(404).send({ message: err.message })
      }
      res.send(500).send({ message: 'Внутренняя ошибка сервера' })
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new CardNotFound('Передан несуществующий id карточки'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: ' Переданы некорректный id карточки для постановки лайка' });
      }
      if (err instanceof CardNotFound) {
        return res.status(404).send({ message: err.message });
      }
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .orFail(() => new CardNotFound('Передан несуществующий id карточки'))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: ' Переданы некорректный id карточки для cнятии лайка' });
    }
    if (err instanceof CardNotFound) {
      return res.status(404).send({ message: err.message });
    }
    res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  });
};
