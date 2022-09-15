const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(Users => res.send({ data: Users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;            // получим из объекта запроса данные пользователя

  User.create({ name, about, avatar })                 // создадим документ на основе пришедших данных
    .then(user => res.send({ data: user }))            // вернём записанные в базу данные
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};