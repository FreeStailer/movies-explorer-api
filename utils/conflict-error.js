const { ErrorConflict } = require('./constants.js');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ErrorConflict;
  }
}

module.exports = ConflictError;
