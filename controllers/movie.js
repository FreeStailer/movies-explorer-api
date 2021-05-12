const Movie = require('../models/movie');
const NotFoundError = require('../utils/notfound-error.js');
const BadRequestError = require('../utils/badrequest-error.js');
const ForbiddenError = require('../utils/forbidden-error');
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
    .orFail(new NotFoundError('Ничего не найдено'))
  // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new ForbiddenError('Попытка удалить чужой фильм'));
      } else {
        return movie.remove()
          .then(() => res.send({ message: `Киношка ${movie.nameRU} удалена из избранного` }));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Конфликтная ошибка');
      }
      throw err;
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
