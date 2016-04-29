var express = require('express');
var path    = require('path');
var router = express.Router();
var models = require('../models/index');

var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var user = require('./user.route')(router);
var helloworld = require('./helloworld.route')(router);

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = router;
