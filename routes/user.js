const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, getUser, updateUserInfo, updateUserAvatar, getCurrentUser,
} = require('../controllers/user');
const { validateReqWithIdParam, validateUpdateUser, validateUpdateUserAvatar } = require('../middlewares/validation');

router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
router.get('/:userId', [auth, validateReqWithIdParam], getUser);
router.patch('/me', [auth, validateUpdateUser], updateUserInfo);
router.patch('/me/avatar', [auth, validateUpdateUserAvatar], updateUserAvatar);

module.exports = router;
