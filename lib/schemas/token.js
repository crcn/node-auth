var mongoose = require("mongoose"),
Schema = mongoose.Schema,
Schema = mongoose.Schema,
ObjectId = Schema.Types.ObjectId,
crypto = require("crypto"),
Profile = require("./profile");

Scope = new Schema({

	/**
	 * the specific 
	 */

	item: ObjectId,

	/**
	 */

	collection: String,

	/**
	 * access level, read, write, read+write
	 */

	access: Number

});

module.exports = new Schema({

	/**
	 * granter of this token
	 */

	
	profile: { type: ObjectId, required: true },

	/**
	 */

	createdAt: { type: Date, default: Date.now },

	/**
	 * when does the token expire?
	 */

	expiresAt: Date,

	/**
	 * who's given the permissions? (optional)
	 */

	grantee: ObjectId,

	/**
	 */

	scopes: [ Scope ],


	/**
	 * time in seconds to keep token alive for. -1 = forever
	 */

	ttl: { type: Number, default: -1 }

});


schema.methods.revoke = function() {
	//TODO
}

/**
 */

schema.methods.regenerateKey = function(onGenerate) {
	this.key = generateKey();
	this.save(onGenerate);
}

/**
 * make sure the grantee is set
 */

schema.pre("save", function(next) {
	if(~this.ttl && !this.expiresAt) {
		this.expiresAt = Date.now() + this.ttl; 
	}

	next();
});


/**
 */

function generateKey() {
	return Date.now() + "_" + Math.round(Math.random() * 999999999999999);
}

