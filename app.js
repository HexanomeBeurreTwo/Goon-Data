var fs = require('fs');

var getFacebookEventsData = require('./client/client.getfacebookdata.js');
var getGrandLyondata = require('./client/client.getgrandlyondata.js');
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

function lunchUpdateData(done)
{
	getGrandLyondata(grandsLyonEndPoint, function(statusCode,data)
	{
		var normilizedEvent = normalize[0](data);
		logActivity(normilizedEvent);
		console.log('Facebook Event Data Updated at : ' + new Date());
		done();
	});  


	getFacebookEventsData(fbEndPoint,function(data)
	{
		var normilizedEvent = normalize[1](data);
		logActivity(normilizedEvent);
		console.log('GrandLyon Data Updated at : ' + new Date());
		done();
	});
	
}


var CronJob = require('cron').CronJob;
var zone = "Europe/Paris";
var job = new CronJob('*/10 * * * * *', function() {
  /* runs once at the specified date. */
	lunchUpdateData(function()
	{
		console.log("Notify Goon Server ?")
	});

    // Notify Goon Server the job is done
  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  zone /* Time zone of this job. */
);
