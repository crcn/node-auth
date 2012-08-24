var structr = require("structr"),
schemas = require("./schemas"),
_ = require("underscore"),
step = require("step");

/**
 * database delegate
 */

module.exports = structr({

	/**
	 */

	"__construct": function(options) {
		this._connection   = options.connection;
		this.ProfileModel  = this._connection.model("profile", schemas.Profile);
		this.TokenModel    = this._connection.model("token", schemas.Token);
		this.ScopeModel    = this._connection.model("scope", schemas.Token.Scope);
		this.defaultTokenTTL = options.tokenTTL || -1; //never
	},

	/**
	 */

	"sandbox": function(requiredPermissions) {
		return new Sandbox(this, Sandbox.parsePermissions(requiredPermissions));
	},

	/**
	 */

	"signup": function(options, onSignup) {
		var user = new this.ProfileModel(options);
		user.save(onSignup);
	},

	/**
	 */

	"login": function(options, onLogin) {

		var on = outcome.error(onLogin),
		self = this;

		var onUser = on.success(function(user) {
			if(!user) return onLogin(self._invalidUserError());
			onLogin.apply(null, arguments);
		});

		if(options.username || options.email) {
			return this._loginWithUP(options, onLogin);
		} else
		if(options.token || options.key) {
			return this._loginWithToken(options, onLogin);
		} else {
			return callback(this._invalidUserError());
		}
	},

	/**
	 */

	"_invalidUserError": function() {
		return new Error("invalid authentication credentials");
	},

	/**
	 * logs in with user / pass
	 */

	"_loginWithUP": function(options, onLogin) {

		var q = { password: options.password }, 
		on = outcome.error(onLogin),
		self = this,
		user,
		token;

		if(options.username) {
			q.username = options.username;
		} else {
			q.email = options.email;
		}

		this.ProfileModel.find(q, onLogin);


		step(

			/**
			 */

			function() {
				self.ProfileModel.find(q, this)
			},

			/**
			 */

			on.success(function(u) {
				user = u;
				if(!user) return onLogin(new Error(self._invalidUserError()));
				user.getToken(this)
			}),

			/**
			 */

			on.success(function(t) {
				token = t;
				token.ttl = options.ttl || self.defaultTokenTTL;
				token.expiresAt = ~token.ttl ? new Date(Date.now() + token.ttl) : null;
				token.save(this)
			}),

			/**
			 */

			on.success(function() {
				this(null, { user: user, token: token });
			}),

			/**
			 */

			onLogin
		);
	},

	/**
	 * logs in with token
	 */

	"_loginWithToken": function(options, onLogin) {

		var TokenModel = this.TokenModel,
		ProfileModel   = this.ProfileModel;

		var q = { key: options.token || options.key },
		on = outcome.error(onLogin),
		token;

		step(

			/**
			 */

			function() {
				TokenModel.findOne(q, this);
			},

			/**
			 */

			on.success(function(t) {
				if(!t) return onLogin(new Error("token does not exist"));
				if(t.expireAt && t.expireAt.getTime() > Date.now()) return onLogin(new Error("token has expired"));
				token = t;
				ProfileModel.find({ _id: token.granter }, this);
			}),

			/**
			 */

			on.success(function(user) {
				onLogin(null, { user: user, token: token });
			})

		);
	}
});