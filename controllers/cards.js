const Card = require('../models/card');
const { ERROR_DATA, ERROR_FIND, ERROR_DEFAULT } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_FIND).send({ message: `Карточка с id: ${req.params.cardId} не найдена` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_FIND).send({ message: `Карточка с id: ${req.params.cardId} не найдена` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_FIND).send({ message: `Карточка с id: ${req.params.cardId} не найдена` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
