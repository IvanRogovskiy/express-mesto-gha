const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, getUser, updateUserInfo, updateUserAvatar, getCurrentUser,
} = require('../controllers/user');

router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
// router.get('/:userId', auth, getUser);
router.patch('/me', auth, updateUserInfo);
router.patch('/me/avatar', auth, updateUserAvatar);

module.exports = router;
