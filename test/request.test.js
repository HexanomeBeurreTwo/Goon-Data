// We need this to build our post string
var querystring = require('querystring');
var http = require('http');

var input = "President Obama called Wednesday on Congress to extend a tax break for students included in last years economic stimulus package, arguing that the policy provides more generous assistance.";

/* curl http://spotlight.sztaki.hu:2222/rest/annotate
 --data-urlencode "text=President Obama called Wednesday on Congress to extend a tax break
   for students included in last year's economic stimulus package, arguing
   that the policy provides more generous assistance."
   --data "confidence=0.35"
   -H "Accept: application/json" */


var confidence='0.35';

function PostCode(input) {

  // Build the post string from an object
	var post_data = querystring.stringify({
		'text' : input,
		'confidence': confidence
		//,'support' : support
	});

  // An object of options to indicate where to post to
  var post_options = {
      host: 'spotlight.sztaki.hu',
      port: '2222',
      path: '/rest/annotate',
      method: 'POST',
      headers: {
          // 'Content-Type': 'application/json',
		      'Accept': 'application/json',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response:\j' + chunk);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
}

PostCode(input);
