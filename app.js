const express = require('express');
const routerUsers = require('./routes/users');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.listen(3000, () => {
  console.log("Сервер запущен!!! Ура!!!")
});

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/users', routerUsers);

