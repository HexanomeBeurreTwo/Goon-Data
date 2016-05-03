var models = require('../models/index');

function getActivities(done) {
	models.Activity.findAll()
	.then(function(activities) {
		console.log("SUCCESS !" + activities.length + " channels founds");
		done(activities);
	})
	.catch(function(err) {
		console.error("ERROR ! Activity access failed with error " + err.stack);
		done(null);
	});
}

function getActivityById(id, done) {
	models.Activity.findById(id)
	.then(function(activity) {
		console.log("SUCCESS !" + activity.name + " activity founds");
		activity.id = id;
		done(activity);
	})
	.catch(function(err) {
		console.error("ERROR ! Activity access failed with error " + err.stack);
		done(null);
	});
}

function getChannels(done) {
	models.Channel.findAll()
	.then(function(channels) {
		console.log("SUCCESS !" + channels.length + " channels founds");
		done(channels);
	})
	.catch(function(err) {
		console.error("ERROR ! Channels access failed with error " + err.stack);
		done(null);
	});
}

function insertChannelActivity(activityId, channelId, confidence) {
	// models.ChannelActivity.create({
	// 	ActivityId: activityItem.name.toLowerCase(),
	// 	ChannelId: activityItem.type,
	// })
	// .then(function(activity) {
	// 	console.log("SUCCESS ! Activity created with id "+ activity.id);
	// 	return true;
	// })
	// .catch(function(err) {
	// 	console.error("ERROR ! Activity insertion failed with error " + err.stack);
	// 	return false;
	// });
	// console.log("Channel id " + channelId);
	// console.log("Activity id " + activityId);
	Promise.all([
	    models.Channel.findOne({where: {id: channelId}}),
	    models.Activity.findOne({where: {id: activityId}})
	])
	.then(function (results) {
		var channel = results[0];
		var activity = results[1];
		console.log("#YOOOOOOOO");
		channel.addActivity(activity, {match: confidence})
		//activity.addChannel(channel, {match: confidence})
		.then(function (success) {
			return true;
		})
		.catch(function (err) {
			console.error(err.stack);
			return false;
		})
	})
	.catch(function (err) {
		console.error(err.stack);
		return false;
	})
}

function matchTags(tagOne, tagTwo) {
	// TODO: Semantic match between words instead of strict string match

	// Calculate % of matching
	return tagOne.toLowerCase() == tagTwo.toLowerCase();
}

function applyMatching(channels, activity, threshold)	{
	channels.forEach(function(channel, channelId)	{
		var channelScore = 0;
		// Cartesian product between activity's tags and channel's tags
		channel.tags.forEach(function(channelTag, channelTagIndex)	{
			if (activity.tags) {
				activity.tags.forEach(function(activityTag, activityTagIndex)	{
					if (matchTags(channelTag, activityTag)) { channelScore++;}
				});
			}
		});

		if (channelScore/channel.tags.length >= threshold) {
			console.log("[TAG MATCHING] Association between channel " + channel.name + " and activity " + activity.name + " found.");
			console.log( JSON.stringify(activity));
			console.log( JSON.stringify(channel));
			insertChannelActivity(activity.id, channel.id, channelScore/channel.tags.length);
		}	else	{
			// console.log("[TAG MATCHING] NO association between channel " + channel.name + " and activity " + activity.name + " found.")
		}
	});
}

function matchingActivities(activities, threshold) {
	if (activities == null || activities.length == 0) {
		console.error("No activities set");
	}	else	{
		getChannels(function(channels)	{
			// console.log( JSON.stringify(channels) +" \n\n");
			// console.log( JSON.stringify(activities) +" \n\n");
			activities.forEach(function(activity, index) {
				// console.log( JSON.stringify(activity) +" \n\n");
				applyMatching(channels, activity, threshold);
			});
		});
	}
}

module.exports.matchingActivities = matchingActivities;

function matchingActivity(activity, threshold) {
	if (activity == null) {
		console.error("No activity set");
	}	else	{
		getChannels(function(channels)	{

			applyMatching(channels, activity, threshold);
		});
	}
}

module.exports.matchingActivity = matchingActivity;

function testChannelTagging() {
	getActivities(function(activities)	{
		// console.log("Activities : " + JSON.stringify(activities));
		matchingActivities(activities, 0.0001);
	});

	// getActivityById(3, function(activity)	{
	// 	console.log(JSON.stringify(activity));
	// 	matchingActivity(activity, 0.0001);
	// });
	// console.log(JSON.stringify(getActivityById(2)));
}

testChannelTagging();
