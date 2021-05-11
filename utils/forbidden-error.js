const { ErrorForbiden } = require('./constants.js');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ErrorForbiden;
  }
}

module.exports = ForbiddenError;
