"use strict";

var fs      = require('fs');
var express = require('express');
var Sequelize = require('sequelize');

var routes = require('./routes/routes.js');


// *** Config Express *** //

var app = express();
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

// *** main routes *** //
app.use('/', routes);

/* Avoid CROSS Origin request */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Goon server listening at http://%s:%s', host, port);
});

module.exports = server;
