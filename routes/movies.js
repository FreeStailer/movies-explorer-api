const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie.js');
const auth = require('../middlewares/auth.js');

router.use(auth);

router.get('/movies', getMovies);

router.post('/movies', celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Поле должно быть валидным url-адресом');
    })
      .messages({
        'any.required': 'Поле "Ссылка" должно быть заполнено',
      }),
      trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Поле должно быть валидным url-адресом');
    })
      .messages({
        'any.required': 'Поле "Ссылка" должно быть заполнено',
      }),
      thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Поле должно быть валидным url-адресом');
    })
      .messages({
        'any.required': 'Поле "Ссылка" должно быть заполнено',
      }),
      movieId: Joi.string().required(),
      nameRU: Joi.string().required().pattern(/^[а-яА-ЯЁё0-9\s]+$/),
      nameEN: Joi.string().required().pattern(/^[a-zA-Z0-9\s]+$/),
    }),
  }), createMovie);

  router.delete('/movies/:movieId', celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }), deleteMovie);
  
  module.exports = router;