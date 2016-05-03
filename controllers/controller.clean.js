var models = require('../models/index');

function cleanOldFacebookActivities(activityItem) {
	// Get all activities which ended yesterday
	// models.Activity.findAll({
	// 	where: {
	// 		date_end:{	$lt: new Date(new Date() - 24 * 60 * 60 * 1000 * 1)	},
	// 		source: "facebook",
	// 	},
	// })
	// .then(function(activities) {
		// console.log("ACTIVITIES: " + JSON.stringify(activities));

		// Destroy activities
		models.Activity.destroy({
			where: {
				date_end:{	$lt: new Date(new Date() - 24 * 60 * 60 * 1000 * 1)	},
				source: "facebook",
			},
		})
		.then(function(activities)	{
			console.log("Older than yesterday activities destroyed. " + activities.lentgh + "#");
		})
		.catch(function(err) {
			console.error("ERROR ! Activities cleaning failed with error " + err.stack);
			return false;
		})
	// })
	// .catch(function(err) {
	// 	console.error("ERROR ! Activities finding failed with error " + err.stack);
	// 	return false;
	// });
}

module.exports.cleanOldFacebookActivities = cleanOldFacebookActivities;
