const routerUsers = require('express').Router();
const { getUsers, getUserById, createUser, editProfile, editAvatar } = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/:userId', getUserById);
routerUsers.post('/', createUser);
routerUsers.patch('/me', editProfile);
routerUsers.patch('/me/avatar', editAvatar);

module.exports = routerUsers;