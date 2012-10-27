```javascript

var auth = require("auth").init({
	connection: mongodbConnection
});

auth.signup({
	username: "john",
	password: "doe"
}, function(err, user) {
	

});

```