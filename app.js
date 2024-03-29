require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes/index.js');

const centralErrorsHandler = require('./middlewares/errors.js'); // выделим центральный обработчик в файл
const { requestLogger, errorLogger } = require('./middlewares/logger.js');

const limiter = require('./middlewares/limiter.js');
const { CorsWhitelist } = require('./utils/constants.js');

const { PORT = 3000 } = process.env;
const { DB_PROD, DB_TEST } = require('./utils/config.js');

const app = express();

app.use(helmet());

mongoose.connect(process.env.mode === 'production' ? DB_PROD : DB_TEST, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
// eslint-disable-next-line no-console
}).then(() => console.log('Соединение с БД-авторизации успешно'))
  .catch((err) => console.log('Ахтунг', err));

app.use(cors(CorsWhitelist));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.send(200);
  }
  next();
});

app.use(express.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(centralErrorsHandler);

app.use(limiter);

app.listen(PORT, () => {
  console.log(`Спутник вышел на орбиту и передает данные по каналу: ${PORT}`);
});
