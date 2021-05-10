const Movie = require('../models/movie');
const NotFoundError = require('../utils/notfound-error.js');
const BadRequestError = require('../utils/badrequest-error.js');
const ConflictError = require('../utils/conflict-error.js');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Ничего не найдено');
      }
      res.status(200).send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError('Попытка создания фильма с неккоректными данными');
      }
      res.status(200).send(movie);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie || movie.owner.toString() !== req.user._id) {
        throw new NotFoundError('Уточните ИД фильма, так как  у пользователя нет такого Id');
      }
      Movie.findByIdAndDelete(req.params.movieId)
        .then(() => {
          res.send({ message: 'Удален из избранного' });
        })
        .catch(next);
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

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
