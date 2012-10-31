var structr = require("structr"),
ownableModel = require("./mixin/ownableModel"),
Account = require("./models/account");


var Auth = structr({

	/**
	 */

	publicKeys: ["login", "signup"],

	/**
	 */

	"__construct": function(options) {
		this.connection = options.connection;
		this.Account    = Account.model(options);
		this.ownable = function(schema) {
			return ownableModel(schema, options.connection);
		}
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
	}
});

exports.access  = require("./access");

exports.connect = function(options) {
	return new Auth(options);
}
