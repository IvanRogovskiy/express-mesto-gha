const router = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard
} = require('../controllers/card');

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
