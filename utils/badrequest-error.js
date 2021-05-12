const { ErrorRequest } = require('./constants.js');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ErrorRequest;
  }
}

module.exports = BadRequestError;
