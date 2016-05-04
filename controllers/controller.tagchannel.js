var models = require('../models/index');

function getActivities(done) {
	models.Activity.findAll()
	.then(function(activities) {
		// console.log("SUCCESS !" + activities.length + " channels founds");
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
		// console.log("SUCCESS !" + activity.name + " activity founds");
		activity.id = id;
		done(activity);
	})
	.catch(function(err) {
		console.error("ERROR ! Activity access failed with error " + err.stack);
		done(null);
	});
}

module.exports.getActivityById = getActivityById;

function getChannels(done) {
	models.Channel.findAll()
	.then(function(channels) {
		// console.log("SUCCESS !" + channels.length + " channels founds");
		done(channels);
	})
	.catch(function(err) {
		console.error("ERROR ! Channels access failed with error " + err.stack);
		done(null);
	});
}

function insertChannelActivity(activityId, channelId, confidence) {
	Promise.all([
	    models.Channel.findOne({where: {id: channelId}}),
	    models.Activity.findOne({where: {id: activityId}})
	])
	.then(function (results) {
		var channel = results[0];
		var activity = results[1];
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

function includes(str,substr) {
	return (str.indexOf(substr) > -1) ;
}

function matchTags(tagOne, tagTwo) {
	// TODO: Semantic match between words instead of strict string match
	// Calculate % of matching
	var tag1 = tagOne.toLowerCase(),
		tag2 = tagTwo.toLowerCase();
	var res = (tag1 == tag2 ) ; 
		res = res || ( includes(tag1,tag2)) ; 
		res = res || ( includes(tag2,tag1));
	return res;
}

function applyMatching(channels, activity, threshold)	{
	channels.forEach(function(channel, channelId)	{
		var channelScore = 0;
		if (channel.tags) {
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
				// console.log( JSON.stringify(activity));
				// console.log( JSON.stringify(channel));
				insertChannelActivity(activity.id, channel.id, channelScore/channel.tags.length);
			}	else	{
				// console.log("[TAG MATCHING] NO association between channel " + channel.name + " and activity " + activity.name + " found.")
			}
		}	else	{
			console.warn("Channel[" + channel.id + "] " + channel.name + " do not have tags");
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

// function testChannelTagging() {
// 	getActivities(function(activities)	{
// 		// console.log("Activities : " + JSON.stringify(activities));
// 		matchingActivities(activities, 0.0001);
// 	});

// 	getActivityById(1, function(activity)	{
// 		console.log(JSON.stringify(activity));
// 		matchingActivity(activity, 0.0001);
// 	});

// }

// testChannelTagging();

// var tagOne = "Hello world, wElcome tO the universe.",
	// tagTwo = "welCOME";
// console.log( matchTags(tagOne, tagTwo) );
// console.log( matchTags(tagTwo,tagOne) );
