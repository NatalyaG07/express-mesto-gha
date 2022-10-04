const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

routerCards.get('/', getCards);

routerCards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/),
  }),
}), createCard);

routerCards.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().required().length(24),
  }),
}), deleteCard);

routerCards.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().required().length(24),
  }),
}), addLike);

routerCards.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().required().length(24),
  }),
}), deleteLike);

module.exports = routerCards;
