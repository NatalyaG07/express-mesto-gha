const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');

const allRouters = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();
app.listen(3000);

app.use(helmet());
app.use(limiter); // подключаем rate-limiter
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors);

app.use(requestLogger); // Логгер запросов нужно подключить до всех обработчиков роутов
app.use(allRouters);

app.use(errorLogger); // нужно подключить после обработчиков роутов и до обработчиков ошибок
app.use(errors());

app.use(errorHandler);
