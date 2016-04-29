var api = require('../app.js'),
request = require('supertest')(api);

describe('Hello World Controller', function() {
  describe('#getHelloWorld()', function () {
  	var msg = {"hello":"Hello World"};
    it('should return right json string: ' + JSON.stringify(msg), function (done) {
    	request
        	.get('/helloworld')
            .expect(msg, done);
    });
  });
});
