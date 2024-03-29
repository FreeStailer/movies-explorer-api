const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  login, createUser, getUserInfo, updateUserInfo,
} = require('../controllers/user.js');
const auth = require('../middlewares/auth.js');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

// next link authorization
router.use(auth);

router.get('/users/me', getUserInfo);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), updateUserInfo);

module.exports = router;
