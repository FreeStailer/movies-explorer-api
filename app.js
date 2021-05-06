require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index.js');

const centralErrorsHandler = ('./middlewares/errors.js') // выделим центральный обработчик в файл
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const limiter = ('./middlewares/limiter.js')

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
// eslint-disable-next-line no-console
}).then(() => console.log('Соединение с БД-авторизации успешно'))
  .catch((err) => console.log('Ахтунг', err));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.send(200);
  }
  next();
})

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




// const cors = require('cors');


// const bodyParser = require('body-parser');

// const { celebrate, Joi } = require('celebrate');
// const { login, createUser } = require('./src/controllers/users.js');
// const { requestLogger, errorLogger } = require('./src/middlewares/logger.js');

// app.use(bodyParser.json());

// app.use(cors()); /// /////////CORS/////////

// app.use('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//   }),
// }), login);

// app.use('/signup', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string().pattern(/^https?:\/\/(www\.)?([a-zA-Z0-9-])+\.([a-zA-Z])+\/?([a-zA-Z0-9\-_~:/#[\]@!&â€™,;=]+)/),
//   }),
// }), createUser);


// // eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message } = err;

//   res
//     .status(statusCode)
//     .send({
//       message: statusCode === 500 ? `На сервере произошла ошибка${err}` : message,
//     });
// });


