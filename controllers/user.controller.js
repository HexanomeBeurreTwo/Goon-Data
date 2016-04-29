'use strict';

var models = require('../models/index');

/**
 * Controller for GET /users/
 * Return all the users of the database
 * @return {Array of User} array contening all the users objects
 */
var getAllUsers = function (req, res) {
  // TODO: Return all users as an array on user
  res.status(500).json({error: 'Getting all user is not allowed.'});
};
module.exports.getAllUsers = getAllUsers;

/**
 * Controller for POST /user/
 * Creates a user in the database
 * @param {string} username : the user username - required
 * @param {string} email : the user email - required
 * @param {string} password : the user password - required
 * @param {string} citizen : the city where the user lives
 * @param {string} age : the user age
 * @return {Object} userId if creating, error else
 */
 // TODO: Use find or create to handle user already created
var addUser = function (req, res) {
  if (!req.body.username)
    res.status(500).json({ error: 'ERROR: Missing params "username"'});
  if (!req.body.email)
    res.status(500).json({ error: 'ERROR: Missing params "email"'});
  if (!req.body.password)
    res.status(500).json({ error: 'ERROR: Missing params "password"'});
  models.User.sync().then(function () {
    models.User.create({
      username: req.body.username.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      citizen: req.body.citizen,
      age: req.body.age,
      tags: null,
    })
    .then(function(user) {
      return res.status(200).json({userId: user.get('id')});
    })
    .catch(function(err) {
      console.error(err.stack);
      return res.status(500).json({error: 'An error occured. User may already exists.'});
    });
  });
};
module.exports.addUser = addUser;

/**
 * Controller for update /user/:id
 * Return a user by id
 * @param {interger} id : the user id
 * @return {User} user if existing, error else
 */
var updateUser = function (req, res) {
  // mise à jour du jour du user à partir de son id
  var userId = req.params.id;
  var selector = { where: { id: userId } };
  var values = new Object();
  if (req.body.username)
    values.username = req.body.username;
  if (req.body.email)
    values.email = req.body.email;
  if (req.body.password)
    values.password = req.body.password;
  console.log(JSON.stringify(values));

  if (values) {
    models.User.findById(userId).then(function(user) {
      return user.update(values, selector);
    }).then(function(user) {
      if(user)
        res.status(200).json(user);
      else 
        res.status(500).json({ error: 'No User with this id :' + userId});
    }).catch(function(error) {
      console.log("ops: " + error);
      res.status(500).json({ error: 'Error updating user: '+ error});
    });
  } else  {
      res.status(500).json({ error: 'No update because there are no username, email or password'});
  }
};
module.exports.updateUser = updateUser;

/**
 * Controller for delete /user/:id
 * Return nothing
 * @param {interger} id : the user id
 */
var deleteUser = function(req, res) {
  // supprime un user à partir de son id
  var userId = req.params.id;
  models.User.findById(userId).then(function(user) {
    return user.destroy();
  }).then(function(user) {
    if(user)
      res.status(200).json({ message: 'User with id'+ userId +' deleted' });
    else 
      res.status(500).json({ error: 'No User with this id :' + userId});
  }).catch(function(error) {
    console.log("ops: " + error);
    res.status(500).json({ error: 'Error deleting user: '+ error});
  });
};
module.exports.deleteUser = deleteUser;

/**
 * Controller for GET /user/:id
 * Return a user by id
 * @param {interger} id : the user id
 * @return {User} user if existing, error else
 */
var getUser = function(req, res) {
  //récuper les infos d'un user à partir de son id
  var userId = req.params.id;
  models.User.findOne({where: {id: userId,}})
  .then(function (user) {
    if(user)
      res.send(user.toJSON());
    else
      res.send('No User with this id :' + userId);
  });
}
module.exports.getUser = getUser;

/**
 * Controller for GET /connection
 * Allows connection for users and return the user object if succed. email or username required
 * @param {string} username : the user username - required (or email)
 * @param {string} email : the user email - required (or username)
 * @param {string} password : the user password - required
 * @return {Object} user if succed, error else
 */
var userConnection = function (req, res) {
  if (!req.query.username && !req.query.email)
    return res.status(500).send('ERROR: Missing params "email" or "username"');
  if (!req.query.password)
    return res.status(500).send('ERROR: Missing params "password"');
  if (req.query.username)
    var query = {username: req.query.username.toLowerCase()};
  else if (req.query.email)
    var query = {email: req.query.email.toLowerCase()};
  models.User.findOne({where: query})
  .then(function (user) {
    if(user.get('password') === req.query.password)
      res.status(200).json(user);
    else
      res.status(500).json({error:'Wrong password'});
  })
  .catch(function(err) {
    console.error(err.stack);
    return res.status(500).json({error:'An error occured. Please try again later.'});
  });
}
module.exports.userConnection = userConnection;
