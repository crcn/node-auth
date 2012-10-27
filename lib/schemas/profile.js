var access = require("../access");

/**
 */

var schema = module.exports = new Schema({

	/**
	 */

	email: { type: String, required: true, index: { unique: true }},

	/**
	 */

	username: { type: String, required: true, index: { unique: true }},

	/**
	 */

	password: { type: String, required: true, set: hashPass },

	/**
	 */

	createdAt: { type: Date, default: Date.now }
});

/**
 */

schema.method.permissions = function() {
	return [{
		profile: this._id,
		access: access.ALL
	}];
}