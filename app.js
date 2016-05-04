var fs = require('fs');

var getFacebookEventsData = require('./client/client.getfacebookdata.js');
var getGrandLyondata = require('./client/client.getgrandlyondata.js');
var normalize = require('./controllers/controller.normalizedata.js');
var insertion = require('./controllers/controller.insert.js');
var clean = require('./controllers/controller.clean.js');
var cron = require('./controllers/controller.cron.js');
var tagchannel = require('./controllers/controller.tagchannel.js');

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
	
	var founded = (normilizedData)? normilizedData.length:0;
	console.log( founded +" Found." );
}

function launchUpdateData(done)
{
	getGrandLyondata(grandsLyonEndPoint, function(statusCode,data)
	{
		normalize.normalizedActivityGL(data, function(activities) {
			// logActivity(normilizedEvent);
			// console.log("[AFTER NORMALIZATION] activities " + JSON.stringify(activities));
			insertion.insertAllActivities(activities, function() {
				console.log('['+activities.length+'] GrandLyon Data Updated at : ' + new Date());
			});
		});
	});  


	getFacebookEventsData(fbEndPoint,function(data)
	{
		normalize.normalizedActivityEventFB(data, function(activities) {
			// logActivity(normilizedEvent);
			// console.log("[AFTER NORMALIZATION] activities " + JSON.stringify(activities));
			insertion.insertAllActivities(activities, function() {
				console.log('['+activities.length+'] Facebook Event Data Updated at : ' + new Date());
			});
		});
	});
	done();
}

function main() {
	launchUpdateData(function()
	{
		console.log("Notify Goon Server Provisionning began ?");
		return;
	});
	clean.cleanOldFacebookActivities();
}

main();

// Replace with true for cron job
cron.cronJob(true, main);
