var fs = require('fs');

var getFacebookEventsData = require('./client/client.getfacebookdata.js');
var getGrandLyondata = require('./client/client.getgrandlyondata.js');
var normalize = require('./controllers/controller.normalizedata.js');
var insertion = require('./controllers/controller.insert.js');
var clean = require('./controllers/controller.clean.js');
var cron = require('./controllers/controller.cron.js');

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

function launchUpdateData(done)
{
	getGrandLyondata(grandsLyonEndPoint, function(statusCode,data)
	{
		var normilizedEvent = normalize[0](data);

		// logActivity(normilizedEvent);
		// insertion.insertAllActivities(normilizedEvent);
		// insertion.insertActivity(normilizedEvent[0]);
		console.log('GrandLyon Data Updated at : ' + new Date());

		done();
	});  


	getFacebookEventsData(fbEndPoint,function(data)
	{
		var normilizedEvent = normalize[1](data);

		// logActivity(normilizedEvent);
		insertion.insertAllActivities(normilizedEvent);
		// insertion.insertActivity(normilizedEvent[0]);
		console.log('Facebook Event Data Updated at : ' + new Date());

		done();
	});
}

function main() {
	launchUpdateData(function()
	{
		console.log("Notify Goon Server ?");
		return;
	});
	// clean.cleanOldFacebookActivities();
}

main();

// Replace with true for cron job
cron.cronJob(false, main);
