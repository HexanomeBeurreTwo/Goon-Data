var tagger = require('./controller.tagger.js');

var maxLength = 255;

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
	  activity.name = item.eventName;
	  activity.type = "EVENT" ;
	  //activity.tags = [];
	  activity.adress = item.venueLocation.street + " " + item.venueLocation.street + " " + item.venueLocation.city + " " + item.venueLocation.zip + " " + item.venueLocation.country ; 
	  activity.latitude = item.venueLocation.latitude;
	  activity.longitude = item.venueLocation.longitude;
	  activity.date_start = formatDate(item.eventStarttime); 
	  var date_end= new Date(new Date(item.eventStarttime).getTime() + 24*3600*1000); // plus one day
	  activity.date_end = formatDate(date_end);
	  activity.continous = false;
	  activity.temporary = true;
	  activity.link = item.eventLink;
	  activity.description = item.eventDescription;
	  activity.source = "facebook";
	  activity.idSource = item.eventId;
	  
	  if(activity.description && activity.description.length > 0) {
	  	tagger.putTags(activity);
	  }
	  if (activity.description && activity.description.length > maxLength) {
	  	activity.description = truncate(activity.description);
	  }

	  activity.phoneNumber = null;	  
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
	  activity.name = item.properties.nom;
	  activity.type = item.properties.type;
	  activity.tags = item.properties.type_detail.split(' ');
	  activity.adress = item.properties.adresse + " " + item.properties.codepostal + " " + item.properties.codepostal + " " + item.properties.commune  ; 
	  activity.latitude = item.geometry.coordinates[1];
	  activity.longitude = item.geometry.coordinates[0];
	  activity.date_start = null ;
	  activity.date_end = null;
	  activity.continous = true;
	  activity.temporary = false;
	  activity.link = item.properties.siteweb;
	  activity.description = item.properties.type_detail+"\n"+item.properties.tarifsenclair+"\n"+item.properties.ouverture;	
	  if (activity.description.length > maxLength) {
	  	activity.description = truncate(activity.description);
	  }
	  activity.phoneNumber = item.properties.telephone;
	  activity.picture = null;
	  activity.source = "grandlyon";
	  activity.idSource = item.properties.id;
	  activities.push(activity);
	});
	return activities;
}

function truncate(trunc) {
	/* Truncate the content of the descritpion, then go back to the end of the
       previous word to ensure that we don't truncate in the middle of
       a word */
    trunc = trunc.substring(0, maxLength);
    trunc = trunc.replace(/\w+$/, '');

    trunc += '...';
    return trunc;
}
 
module.exports = [normalizedActivityGL,normalizedActivityEventFB];



