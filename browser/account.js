var structr = require("structr"),
_ = require("underscore");

exports.connect = function(host) {

	var Account;
	return Account = structr({
		"__construct": function(data) {
			_.extend(this, data);
		},
		"save": function() {
			//TODO
		},
		"static login": function(data, onLogin) {
			if(arguments.length == 1) {
				onLogin = data;
				data = {};
			}

			$.ajax({
				type: "GET",
				data: data,
				url: host + "/account.json",
				success: function(resp) {
					if(resp.errors) return onLogin(new Error(resp.errors[0]));
					onLogin(null, new Account(resp.result));
				}
			})
		}
	});
}


