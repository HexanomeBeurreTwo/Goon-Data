var querystring = require('querystring');
var http = require('http');

/* curl http://spotlight.sztaki.hu:2222/rest/annotate  --data-urlencode "text=President Obama called Wednesday on Congress to extend a tax break    for students included in last year's economic stimulus package, arguing    that the policy provides more generous assistance."    --data "confidence=0.35"     -H "Accept: application/json" */  
   
var confidence='0.35';

function spotlightRequest(input,callback) 
{
    var post_data = querystring.stringify({
        'text' : input,
        'confidence': confidence
    });
	
  // Spotlight end point
  var spotlight_config = {
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
  var post_req = http.request(spotlight_config, function(res) {
    res.setEncoding('utf8');
	res.on('error', function(e) {
	  var response={};
	  var output={
		'endpoint':spotlight_config.host+':'+spotlight_config.port+spotlight_config.path,
		'error':e,
		'response':response
	  }
	  callback(output);
	});
	var body='';
	res.on('data', function (chunk) {
		body += chunk;
		//console.log(chunk);
	});
	res.on('end', function () {
		var error = 0;
		try{
			//console.log(body);
			var response=JSON.parse(body);
		}catch(e){
			var response={};
			error = 1;
		}
		var output={
			'endpoint':spotlight_config.host+':'+spotlight_config.port+spotlight_config.path,
			'error':error,
			'response':response
		}
		callback(output);
	});
  });
  // post the data
  post_req.write(post_data);
  post_req.end();
}
 
// TEST
// var input = "President Obama called Wednesday on Congress to extend a tax break for students included in last years economic stimulus package, arguing that the policy provides more generous assistance.";
// spotlightRequest(input,function(output){console.log(output)});


function extracte_tags(SpotlightRespense)
{
	var tags = [];
	SpotlightRespense.Resources.forEach(function(item, index) 
	{
		tags.push(item['@surfaceForm']);
	});
	return tags;
}

function updateTagsActivity(activity)
{	
	//activity.description
	//activity.tags
	spotlightRequest(activity.description,function(SpotlightOutput)
	{
		if(!SpotlightOutput.error)
		{
			activity.tags =  extracte_tags(SpotlightOutput.response);
		}else {
			activity.tags = [];
		}
		console.log(actvity);
	});
		
}  


// TEST
// var actvity = {
	// description : input,
	// tags : []
// }
// updateTagsActivity(actvity);

module.exports = {putTags:updateTagsActivity};


