var structr = require("structr"),
ownableModel = require("./mixin/ownableModel"),
Account = require("./models/account");


var Auth = structr({

	/**
	 */

	"__construct": function(options) {
		this.connection = options.connection;
		this.Account    = Account.model(options.connection);
	},

	/**
	 * logs the user in
	 */

	"login": function(credentials, callback) {
		this.Account.login.apply(this.Account, arguments);
	},

	/**
	 * signs a user up
	 */

	"signup": function() {
		this.Account.signup.apply(this.Account, arguments);
	},

	/**
	 */

	"ownable": function(schema) {
		return ownableModel(model, this.connection);
	}


});

exports.access  = require("./access");

exports.connect = function(options) {
	return new Auth(options);
}
