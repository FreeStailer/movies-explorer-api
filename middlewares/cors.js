const { CorsWhitelist } = require('../utils/constants.js');

const CorsOptions = {
  credentials: true,
  origin: function checkCorsList(origin, callback) {
    if (CorsWhitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('CORS it is CORS by CORS from CORS'));
    }
  },
};

module.exports = CorsOptions;
