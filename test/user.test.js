var api = require('../app.js'),
request = require('supertest')(api);
// var mocha = require('mocha');
var chai = require('chai')
var expect = chai.expect;

var userId;
var callbackCounter = 0;
var username = "usertest";
var password = "passwordtest";
var email = "test@continuous-integration-test.com";
var citizen = "lyon";

describe('GET /users', function() {
  describe('#getAllUsers()', function () {
    it('respond with json', function (done) {
    	request
        .get('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500, {error: 'Getting all user is not allowed.'})
        .end(function(err, res) {
          if(err) return done(err);
          done();
        });
    });
  });
});

describe('POST /user', function() {
  describe('#addUser()', function () {
    it('respond with json', function (done) {
    	request
        .post('/user')
        .set('Accept', 'application/json')
        // .expect('Content-Type', /json/)
        .send({
              'username': username,
              'password': password,
              'email': email,
              'citizen': citizen
              })
        .expect(hasUserIdKeys)
        .expect(200)
        .end(function(err, res) {
            if(err) return done(err);
            console.log(res.body);
            userId = res.body.userId;
            modify();
            done();
        });
    });
  });
});

function modify() {
  describe('PUT /user/:id', function() {
    describe('#updateUser()', function () {
      if (userId != null) {
        var newUsername = "usertester";
        it('respond with json', function (done) {
        	request
            .put('/user/'+userId)
            .set('Accept', 'application/json')
            // .expect('Content-Type', /json/)
            .send({
              'username': newUsername,
              'password': password,
              'email': email,
              'citizen': citizen
            })
            .expect(200)
            .end(function(err, res) {
              if(err) return done(err);

              username = newUsername;
              expect(res.body.username).to.equal(username);
              expect(res.body.email).to.equal(email);
              expect(res.body.password).to.equal(password);
              expect(res.body.citizen).to.equal(citizen);
              expect(res.body.age).to.equal(null);
              expect(res.body.tags).to.equal(null);
              // expect(res.body.createdAt).to.equal("2016-04-28T13:04:49.421Z");
              // expect(res.body.updatedAt).to.equal("2016-04-28T13:04:49.421Z");
              deleteUser();
              done();
            });
        });
      } else  {
        console.log('PUT not done. Body: '+userId);
      }
      callbackCounter++;
    });
  });

  describe('GET /user/:id', function() {
    describe('#getUser()', function () {
      if (userId != null) {
        it('respond with json', function (done) {
        	request
            .get('/user/'+userId)
            .set('Accept', 'application/json')
            // .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if(err) return done(err);

              expect(res.body.id).to.equal(userId);
              expect(res.body.username).to.equal(username);
              expect(res.body.email).to.equal(email);
              expect(res.body.password).to.equal(password);
              expect(res.body.citizen).to.equal(citizen);
              expect(res.body.age).to.equal(null);
              expect(res.body.tags).to.equal(null);
              // expect(res.body.createdAt).to.equal("2016-04-28T13:04:49.421Z");
              // expect(res.body.updatedAt).to.equal("2016-04-28T13:04:49.421Z");
              done();
            });
        });
      } else  {
        console.log('GET user info not done. Body: '+userId);
      }
      callbackCounter++;
    });
  });
  describe('GET /connection', function() {
    describe('#userConnection()', function () {
      if (userId != null) {
        it('respond with json', function (done) {
          request
            .get('/connection')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Accept', 'application/json')
            // .expect('Content-Type', /json/)
            .query({
              'username': username,
              'password': password
              })
            .expect(200)
            .end(function (err, res) {
              // if(err) return done(err);

              expect(res.body.id).to.equal(userId);
              expect(res.body.username).to.equal(username);
              expect(res.body.email).to.equal(email);
              expect(res.body.password).to.equal(password);
              expect(res.body.citizen).to.equal(citizen);
              expect(res.body.age).to.equal(null);
              expect(res.body.tags).to.equal(null);
              done();
            });
        });
      } else  {
        console.log('GET connection not done. Body: '+userId);
      }
      callbackCounter++;
    });
  });
}

deleteUser();

function deleteUser() {
  if(callbackCounter != 3) return;
  describe('DELETE /user/:id', function() {
    describe('#deleteUser()', function () {
      if (userId != null) {
        it('respond with json', function (done) {
          request
            .delete('/user/'+userId)
            .set('Accept', 'application/json')
            // .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) return done(err);
              // expect(res.body).to.equal('User with id'+ userId +' deleted');
              done();
            });
        });
      } else  {
        console.log('DELETE not done. Body: '+userId);
      }
    });
  });
}

function hasUserIdKeys(res) {
  if (!('userId' in res.body)) throw new Error("missing userId key. Body :" + JSON.stringify(res.body));
}