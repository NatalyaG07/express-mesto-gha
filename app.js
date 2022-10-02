const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const {
  login,
  createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
app.listen(3000);

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
