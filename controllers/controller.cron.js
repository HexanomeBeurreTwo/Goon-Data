var CronJob = require('cron').CronJob;
var zone = "Europe/Paris";
var job = null;

function cronJob(activate, done) {
	if (activate) {
		job = new CronJob('*/10 * * * * *', function() {
		  /* runs once at the specified date. */
			done();

		    // Notify Goon Server the job is done
		  }, function () {
		    /* This function is executed when the job stops */
		  },
		  true, /* Start the job right now */
		  zone /* Time zone of this job. */
		);
	}
}


module.exports.cronJob = cronJob;
