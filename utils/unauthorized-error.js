const { ErrorAuthorization } = require('./constants.js');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ErrorAuthorization;
  }
}

module.exports = UnauthorizedError;
