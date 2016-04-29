'use strict';

var user = require ("../controllers/user.controller");

module.exports = function(router)
{
  router.get('/users', user.getAllUsers);
  router.post('/user', user.addUser);
  router.put('/user/:id', user.updateUser);
  router.delete('/user/:id', user.deleteUser);
  router.get('/user/:id', user.getUser);
  router.get('/connection', user.userConnection);
};
