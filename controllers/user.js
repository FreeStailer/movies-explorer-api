const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../utils/notfound-error.js');
const ConflictError = require('../utils/conflict-error.js');
const BadRequestError = require('../utils/badrequest-error.js');
const UnauthorizedError = require('../utils/unauthorized-error.js');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const { email, name } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.status(200).send({ mail: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Такой емейл уже есть');
      }
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send([user.email, user.name]);
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    email: req.body.email,
    name: req.body.name,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Ошибка при редактировании данных');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Конфликтная ошибка');
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError('Авторизация не пройдена');
    })
    .catch(next);
};

module.exports = {
  login,
  createUser,
  getUserInfo,
  updateUserInfo,
};
