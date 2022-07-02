const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');
const {
  validateCreateCard, validateReqWithCardIdParam,
} = require('../middlewares/validation');

router.post('/', [auth, validateCreateCard], createCard);
router.get('/', auth, getCards);
router.delete('/:cardId', [auth, validateReqWithCardIdParam], deleteCard);
router.put('/:cardId/likes', [auth, validateReqWithCardIdParam], likeCard);
router.delete('/:cardId/likes', [auth, validateReqWithCardIdParam], dislikeCard);

module.exports = router;
