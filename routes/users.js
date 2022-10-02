const routerUsers = require('express').Router();
const {
  getUsers,
  getUserById,
  editProfile,
  editAvatar,
  getInfoAboutMe,
} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/me', getInfoAboutMe);
routerUsers.patch('/me', editProfile);
routerUsers.patch('/me/avatar', editAvatar);
routerUsers.get('/:userId', getUserById);

module.exports = routerUsers;
