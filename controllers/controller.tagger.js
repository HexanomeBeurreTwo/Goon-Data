var querystring = require('querystring');
var http = require('http');

/* curl http://spotlight.sztaki.hu:2222/rest/annotate
 --data-urlencode "text=President Obama called Wednesday on Congress to extend a tax break
   for students included in last year's economic stimulus package, arguing
   that the policy provides more generous assistance."
   --data "confidence=0.35"
   -H "Accept: application/json" */
   
var confidence='0.35';
var support ='0.0';

function PostCode(input,cb) {
    var post_data = querystring.stringify({
        'text' : input,
        'confidence': confidence,
        'support' : support
    });
	
  // Spotlight end point
  var post_options = {
      host: 'spotlight.sztaki.hu',
      port: '2225',
      path: '/rest/annotate',
      method: 'POST',
      headers: {
            'Accept': 'application/json',
			'Content-Length': Buffer.byteLength(post_data)
      }
  };
  // Set up the request
  var post_req = http.request(post_options, function(res) {
    res.setEncoding('utf8');
	res.on('error', function(e) {
	  var response={};
	  var output={
		'endpoint':spotlight_config.host+':'+spotlight_config.port+spotlight_config.path,
		'error':e,
		'response':response
	  }
	  cb(output);
	});
	var body='';
	res.on('data', function (chunk) {
		body += chunk;
		console.log(chunk);
	});
	res.on('end', function () {
		try{
			var response=JSON.parse(body);
		}catch(e){
			var response={};
		}
		var output={
			'endpoint':spotlight_config.host+':'+spotlight_config.port+spotlight_config.path,
			'error':0,
			'response':response
		}
		cb(output);
	});
  });
  // post the data
  post_req.write(post_data);
  post_req.end();
}


var input = "President Obama called Wednesday on Congress to extend a tax break for students included in last years economic stimulus package, arguing that the policy provides more generous assistance.";
PostCode(input,function(output){console.log(output)});


function extracte_tags(SpotlightRespense)
{
	var tags = [];
	SpotlightRespense.forEach(Resources)function(item, index) 
	{
		tags.push(item.@surfaceForm);
	}
	return tags;
}
