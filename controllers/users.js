const User = require("../models/user");
const { ERROR_DATA, ERROR_FIND, ERROR_DEFAULT } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(Users => res.send({ data: Users }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if(user === null) {
        return res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.send({ data: user })
      }
    })
    .catch((err) => {
      if(err.name === 'CastError') {
        return res.status(ERROR_FIND).send({ message: `Пользователь с id: ${req.params.userId} не найден` });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
  });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;            // получим из объекта запроса данные пользователя

  User.create({ name, about, avatar })                 // создадим документ на основе пришедших данных
    .then(user => res.send({ data: user }))            // вернём записанные в базу данные
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
  });
};

module.exports.editProfile = (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { name: req.body.name, about: req.body.about }, {
    new: true,                                          // обработчик then получит на вход обновлённую запись
    runValidators: true,                                // данные будут валидированы перед изменением
  })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
  });
};

module.exports.editAvatar = (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { avatar: req.body.avatar }, {
    new: true,                                          // обработчик then получит на вход обновлённую запись
    runValidators: true,                                // данные будут валидированы перед изменением
  })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
  });
};