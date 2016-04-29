'use strict';

var models = require('../models/index');

var getHelloWorld = function (req, res) {
  var msg = {"hello":"Hello World"};

  return res.contentType('application/json').send(JSON.stringify(msg));
};
module.exports.getHelloWorld = getHelloWorld;
