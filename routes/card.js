const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');
const {
  validateCreateCard, validateDeleteCard, validateLikeCard, validateDislikeCard,
} = require('../middlewares/validation');

router.post('/', [auth, validateCreateCard], createCard);
router.get('/', auth, getCards);
router.delete('/:cardId', [auth, validateDeleteCard], deleteCard);
router.put('/:cardId/likes', [auth, validateLikeCard], likeCard);
router.delete('/:cardId/likes', [auth, validateDislikeCard], dislikeCard);

module.exports = router;
