const { ErrorNotFound } = require('./constants.js');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ErrorNotFound;// 404
  }
}

module.exports = NotFoundError;
