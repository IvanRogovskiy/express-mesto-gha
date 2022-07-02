const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, getUser, updateUserInfo, updateUserAvatar, getCurrentUser,
} = require('../controllers/user');
const { validateUpdateUser, validateUpdateUserAvatar, validateReqWithUserIdParam } = require('../middlewares/validation');

router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
router.get('/:userId', [auth, validateReqWithUserIdParam], getUser);
router.patch('/me', [auth, validateUpdateUser], updateUserInfo);
router.patch('/me/avatar', [auth, validateUpdateUserAvatar], updateUserAvatar);

module.exports = router;
