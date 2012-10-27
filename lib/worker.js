var structr = require("structr"),
step        = require("step"),
outcome     = require("outcome"),
cronjob     = require("cronworker");



/**
 * Worker that handles any permission changes.
 */

module.exports = structr({

	/**
	 */

	"__construct": function(options) {
		this._cronjob       = cronjob.init(options.connection);
		this.defaultTimeout = options.defaultTimeout || 1000 * 10;
	},

	/**
	 * starts the cron worker
	 */

	"start": function(timeout) {
		this._timeout = timeout || this._timeout || this.defaultTimeout;

		var self = this;
		this._cronJob.onJob(function() {
			self._onJob(job, onComplete);
		})
	},

	/**
	 */

	"stop": function() {
		clearTimeout(this._timeout);
	},

	/**
	 */

	"_onJob": function(job, onComplete) {
		//TODO
		var self = this, on = outcome.error(onComplete), perms = this.permissions;

		step(

			/**
			 */

			function() {
			},

			/**
			 */

			on.success(function(newPermissions) {

			}),

			/**
			 */

			function() {
				self.start();
			}
		);
	}
});