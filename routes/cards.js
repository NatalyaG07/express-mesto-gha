const routerCards = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

routerCards.get('/', getCards);
routerCards.post('/', createCard);
routerCards.delete('/:cardId', deleteCard);

module.exports = routerCards;