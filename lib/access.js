// module.exports = bitmaskify(["GET", "POST", "PUT", "DELETE"]);
["GET", "POST", "PUT", "DELETE", "SUPER"].forEach(function(method) {
	exports[method] = method;
});