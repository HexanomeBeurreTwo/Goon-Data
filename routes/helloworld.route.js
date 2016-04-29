'use strict';

var helloworld = require ("../controllers/helloworld.controller");

module.exports = function(router)
{
  router.get('/helloworld', helloworld.getHelloWorld);
};