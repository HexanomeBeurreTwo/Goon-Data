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




var CronJob = require('cron').CronJob;
var zone = "Europe/Paris";
var job = new CronJob('*/20 * * * * *', function() {
  /* runs once at the specified date. */
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

	console.log("HHHHHHEEEEEELLLLLLLLLLO");
    // Notify Goon Server the job is done
  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  zone /* Time zone of this job. */
);
