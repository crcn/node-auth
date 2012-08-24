var mongoose = require("mongoose"),
step = require("step"),
outcome = require("outcome");

var auth = require("../").init({
	connection: mongoose.connect("mongodb://localhost:27017/auth")
});


var on = outcome.error(function(err) {
	console.error(err.stack);
}),
user;


step(

	/**
	 */

	function() {
		auth.signup({ username: "craig", email: "craig.j.condon@gmail.com", password: "test" }, this);
	},

	/**
	 */

	on.success(function(u) {
		user = u;
		console.log(u)
		u.getToken(this);
	}),

	/**
	 */

	on.success(function(token) {
		console.log(token);
		this();
	}),

	/**
	 */

	function() {
		user.remove();
	}
);