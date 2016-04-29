var fs = require('fs');

// var activityModel = JSON.parse(fs.readFileSync('../wiki/activityModel.json', 'utf8'));

function formatDate(dateStr)
// from "2016-05-26T09:00:00+0200" to "2016-05-26 07:00:00"
{
	return new Date(dateStr).toISOString().
		   replace(/T/, ' ').   // replace T with a space
		   replace(/\..+/, ''); //item.eventStarttime;

}


function normalizedActivityEventFB(JsonEvents)
{
	var activities = [];
	JsonEvents.events.forEach(function(item, index) {
	  var activity = {};//activityModel;
	  activity.id = item.eventId;
	  activity.name = item.eventName;
	  activity.type = "event" ;
	  activity.tags = [];
	  activity.adress = item.venueLocation.street + " " + item.venueLocation.street + " " + item.venueLocation.city + " " + item.venueLocation.zip + " " + item.venueLocation.country ; 
	  activity.coordinate = [ item.venueLocation.longitude,item.venueLocation.latitude];
	  activity.date_start = formatDate(item.eventStarttime); 
	  var date_end= new Date(new Date(item.eventStarttime).getTime() + 24*3600*1000); // plus one day
	  activity.date_end = formatDate(date_end);
	  activity.continous = false;
	  activity.link = item.eventLink;
	  activity.description = item.eventDescription;
	  activity.phoneNumber = "";	  
	  activity.picture = item.eventProfilePicture;
	  activities.push(activity);
	});
	return activities;
}

function normalizedActivityGL(JsonEvents)
{
	var activities = [];
	JsonEvents.features.forEach(function(item, index) {
	  var activity = {};//activityModel;
	  activity.id = item.properties.id;
	  activity.name = item.properties.nom;
	  activity.type = item.properties.type;
	  activity.tags = item.properties.type_detail.split(' ');
	  activity.adress = item.properties.adresse + " " + item.properties.codepostal + " " + item.properties.codepostal + " " + item.properties.commune  ; 
	  activity.coordinate = item.geometry.coordinates ;
	  activity.date_start = "" ;
	  activity.date_end = "";
	  activity.continous = true;
	  activity.link = item.properties.siteweb;
	  activity.description = item.properties.type_detail+"\n"+item.properties.tarifsenclair+"\n"+item.properties.ouverture;	
	  activity.phoneNumber = item.properties.telephone;
	  activity.picture = "";
	  activities.push(activity);
	});
	return activities;
}

 
module.exports = [normalizedActivityGL,normalizedActivityEventFB];



