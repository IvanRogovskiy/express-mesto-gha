const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  const owner = req.user._id;
  Card.create({
    name, link, likes, createdAt, owner,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(500).send({ message: err.message });
      }
      res.send({ message: err });
    });
};

module.exports.deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .orFail(() => new Error('Карточка с указанным _id не найдена.'))
    .catch((err) => res.status(404).send({ message: err.message }));
};
