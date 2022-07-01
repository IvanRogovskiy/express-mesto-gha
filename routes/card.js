const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');
const {
  validateCreateCard, validateReqWithIdParam,
} = require('../middlewares/validation');

router.post('/', [auth, validateCreateCard], createCard);
router.get('/', auth, getCards);
router.delete('/:cardId', [auth, validateReqWithIdParam], deleteCard);
router.put('/:cardId/likes', [auth, validateReqWithIdParam], likeCard);
router.delete('/:cardId/likes', [auth, validateReqWithIdParam], dislikeCard);

module.exports = router;
