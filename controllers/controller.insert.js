
var models = require('../models/index');
var tagchannel = require('./controller.tagchannel');
var async = require('async');

function isAllreadyInDB(activity, done) {  // CF Clean
	models.Activity.findAll({
		where: {
			idSource:activity.idSource,
			source: activity.source,
		},
	})
	.then(function(activities) {
		if(activities.length == 0 )	{
			done(false);
		}
		else	{
			done(true);
		}
	})
	.catch(function(err) {
		console.error("ERROR function: isAllreadyInDB ! finding failed with error " + err.stack);
		done(true);
	});
}

function insertActivity(activityItem, done) {
	// console.log("[TAGS]: " + activityItem.tags);
	isAllreadyInDB(activityItem, function(isInDB) {
		if(!isInDB)
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
				// console.log("SUCCESS ! Activity created with id "+ activity.id);
				done(activity);
			})
			.catch(function(err) {
				console.error("ERROR ! Activity insertion failed with error " + err.stack);
				done(null);
			});
		}	else	{
			// console.log("Activity "+activityItem.name+" is already in DataBase");
			done(null);
		}
	});
	
}

module.exports.insertActivity = insertActivity;

function insertAllActivities(data, callback) {
	async.each(data, function(item, callback) {
		// console.log("[ITEM] " + JSON.stringify(item));
		insertActivity(item, function(activity)	{
			if (activity) {
				tagchannel.matchingActivity(activity, 0.0001);
			}	else	{
				console.error("Activity is null so insertion failed");
			}
			callback();
		});
	}, function(err)	{
		callback();
	});
}

module.exports.insertAllActivities = insertAllActivities;