const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const DataError = require('../errors/data-err');
const ConflictError = require('../errors/conflict-error');

// const JWT_SECRET = crypto.randomBytes(16).toString('hex');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      } else if (err.name === 'CastError') {
        next(new DataError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body; // получим из объекта запроса данные пользователя

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })) // создадим документ на основе пришедших данных
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    })) // вернём записанные в базу данные
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.editProfile = (req, res, next) => {
  User.findOneAndUpdate({ _id: req.user._id }, { name: req.body.name, about: req.body.about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.editAvatar = (req, res, next) => {
  User.findOneAndUpdate({ _id: req.user._id }, { avatar: req.body.avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => { // контроллер аутентификации
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({
        token,
        name: user.name,
        email: user.email,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch(next);
};

module.exports.getInfoAboutMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь с id не найден'));
      } else {
        next(err);
      }
    });
};
