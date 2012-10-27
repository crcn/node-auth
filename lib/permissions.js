var structr = require("structr"),
access      = require("./access"),
cronjob     = require("cronjob"),
step        = require("step"),
seq         = require("seq");


module.exports = structr({

	/**
	 */

	"__construct": function(options) {

		this.connection = options.connection;


		this._cronjob = cronjob.init({
			type: "mongo",
			connection: options.connection
		});
	},

	/**
	 */

	"start": function() {
		var self = this;
		this._cronjob.onJob(function() {
			self._grantPermissions.apply(self, arguments);
		});
	},

	/**
	 * give permissions
	 */

	"grant": function(granter, grantee, permissions) {

	},

	/**
	 * revoke permissions
	 */

	"revoke": function(granter, grantee, permissions) {

	},

	/**
	 */

	"_grantPermissions": function(job, onComplete) {

		var con = this.connection;

		var data    = job.data,
		granter     = data.granter, 
		grantee     = data.grantee, 
		acc         = data.access, //bitmasked access level
		collections = [data.collection]; //todo - grant access for wild card

		//go through each of the collections 
		seq(collections).seqEach(function(collectionName) {

			var next = this;

			//make sure the user has the ability to update items
			var col = con.model(collectionName), s = {
				"permissions.profile": granter,
				"permissions.access": access.SUPER
			};

			//search for the owner, and first REMOVE the permissions
			col.update(s, {
				$pull: {
					permissions: {
						profile: grantee
					}
				}
			},
			{ multi: true }, outcome.error(onComplete).success(function() {
				col.update(s, {
					$push: {
						permissions: {
							profile: grantee,
							access: acc
						}

					}
				}, { multi: true }, next);
			}));
		}).
		catch(onComplete).
		seq(onComplete);
	
});


function explodePermissions(permissions) {

}