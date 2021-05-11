const CorsWhitelist = [
  'http://localhost:3000',
  'https://kinopoisk.nomoredomains.club',
  'http://kinopoisk.nomoredomains.club',
];

const ErrorSever = 500;
const ErrorRequest = 400;
const ErrorAuthorization = 401;
const ErrorForbiden = 403;
const ErrorNotFound = 404;
const ErrorConflict = 409;

module.exports = {
  CorsWhitelist,
  ErrorAuthorization,
  ErrorConflict,
  ErrorForbiden,
  ErrorNotFound,
  ErrorRequest,
  ErrorSever,
};
