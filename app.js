const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const app = express();
app.listen(3000);

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6322f4089a7a7fd010a62b7f',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
