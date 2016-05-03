var models = require('../models/index');

function insertActivity(activityItem) {
	//console.log("Activity : "+ JSON.stringify(activityItem));
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
		return true;
	})
	.catch(function(err) {
		console.error("ERROR ! Activity insertion failed with error " + err.stack);
		return false;
	});
}

module.exports.insertActivity = insertActivity;

function insertAllActivities(data) {
	data.forEach(function(item, index) {
		insertActivity(item);
	});
}

module.exports.insertAllActivities = insertAllActivities;