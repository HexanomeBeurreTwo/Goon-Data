var fs = require('fs');

var getfacebookdata = require('./client/client.getfacebookdata.js');
var getgrandlyondata = require('./client/client.getgrandlyondata.js');
var normalize = require('./controllers/controller.normalizedata.js');

var endpointsConfig = JSON.parse(fs.readFileSync('endpoints.config.json', 'utf8'));

// GRAND LYON
var grandsLyonEndPoint = endpointsConfig.grandsLyonEndPoint;

// FACEBOOK
var fbEndPoint = endpointsConfig.fbEventEndPoint;
fbEndPoint.distance = "1000";
fbEndPoint.sort="venue";


function logActivity(normilizedData)
{	
	normilizedData.forEach(function(item, index) {
	  console.log( JSON.stringify(item) +" \n\n");
	});
	
	console.log( normilizedData.length +" Found." );
}


getgrandlyondata(grandsLyonEndPoint, function(statusCode,data)
{
	var normilizedEvent = normalize[0](data);
	logActivity(normilizedEvent);
});  


getfacebookdata(fbEndPoint,function(data)
{
	var normilizedEvent = normalize[1](data);
	logActivity(normilizedEvent);
});
