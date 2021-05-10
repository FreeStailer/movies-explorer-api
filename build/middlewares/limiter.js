const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 14 * 60 * 1000,
  max: 100,
});

module.exports = limiter;
