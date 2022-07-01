const { CastError } = require('../errors/CastError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ValidationError } = require('../errors/ValidationError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
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
        next(new ValidationError(`Переданы некорректные данные при создании карточки для следующих полей: ${fields.join(', ')}`));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена.', 'CardNotFoundError');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError(`Нет прав для удаления карточки с id: ${cardId}`);
      }
      Card.findByIdAndRemove(cardId)
        .then(() => res.send({ message: 'Пост удален' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Передан некорректный id карточки при удалении карточки'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const cardNotFoundErr = new NotFoundError('Карточка с указанным _id не найдена.', 'CardNotFoundError');
      throw cardNotFoundErr;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Передан некорректный id карточки при удалении карточки'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const cardNotFoundErr = new NotFoundError('Передан несуществующий id карточки.', 'CardNotFoundError');
      throw cardNotFoundErr;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Передан некорректный id карточки при удалении карточки'));
      }
      next(err);
    });
};
