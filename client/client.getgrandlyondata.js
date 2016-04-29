var http = require('http');
var https = require('https');


function getRessourceJson(options,onResult) 
{

	var prot = options.protocol == 'https:' ? https : http;
	var httpclient = prot.request(options, function (res) {
			
		console.log(options.host + ':' + res.statusCode);
		res.setEncoding('utf8');
		
		var output = '';

		
		res.on('data', function (chunk) {
			output += chunk;
		});
		
		
		res.on('end', function() {
			var data = JSON.parse(output);			
			onResult(res.statusCode, data);
			
		});
		
		
	});

	httpclient.on('error', function(e)  {
		console.log("Got_error " + e.message);
	});

	httpclient.end();
};



module.exports = getRessourceJson;