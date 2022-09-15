const routerUsers = require('express').Router();
const { getUsers, getUserById, createUser} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/:userId', getUserById);
routerUsers.post('/', createUser);

module.exports = routerUsers;