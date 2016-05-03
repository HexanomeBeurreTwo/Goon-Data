
var models = require('../models/index');


function isAllreadyInDB(activity) {  // CF Clean
	models.Activity.findAll({
		where: {
			idSource:activity.idSource,
			source: "facebook",
		},
	})
	.then(function(activities) {
		if(activities.length == 0 )
			return true;
		return false;
	})
	.catch(function(err) {
		console.error("ERROR function: isAllreadyInDB ! finding failed with error " + err.stack);
		return false;
	});
}

function insertActivity(activityItem, done) {
	//console.log("Activity : "+ JSON.stringify(activityItem));
	if(! isAllreadyInDB(activityItem))
	{
		models.Activity.create({
			name: activityItem.name.toLowerCase(),
			type: activityItem.type,
			description: activityItem.description ? activityItem.description.toLowerCase() : null,
			tags: activityItem.tags,
			address: activityItem.address,
			latitude: activityItem.latitude,
			longitude: activityItem.longitude,
			temporary: activityItem.temporary,
			date_start: activityItem.date_start,
			date_end: activityItem.date_end,
			source: activityItem.source,
			idSource: activityItem.idSource,
			opening_hours: activityItem.opening_hours,
		})
		.then(function(activity) {
			console.log("SUCCESS ! Activity created with id "+ activity.id);
			done(activity);
		})
		.catch(function(err) {
			console.error("ERROR ! Activity insertion failed with error " + err.stack);
			done(null);
		});
	}else {
		console.log("Activity "+activityItem.name+" is already in DataBase");
	}
}

module.exports.insertActivity = insertActivity;

function insertAllActivities(data) {
	data.forEach(function(item, index) {
		insertActivity(item, function(activity)	{
			if (activity) {
				tagchannel.matchingActivity(activity, 0.0001);
			}	else	{
				console.error("Activity is null so insertion failed");
			}
		});
	});
	return;
}

module.exports.insertAllActivities = insertAllActivities;