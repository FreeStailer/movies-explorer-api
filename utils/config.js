require('dotenv').config();

const { DB_PROD, DB_TEST = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

module.exports = {
  DB_PROD,
  DB_TEST,
};
