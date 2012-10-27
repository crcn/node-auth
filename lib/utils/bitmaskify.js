module.exports = function(methods) {

	var prev = 1, all;

	var exp = {};

	for(var i = methods.length; i--;) {
		all |= prev = exp[methods[i]] = prev <<  2;
	}


	//all permissions
	exp.ALL = all;

	//how do we grant permissions on the global scale for say... administrators?

	exp.code = function(name) {
		return ~methods.indexOf(String(name).toUpperCase()) ? exports[name] : 0;
	};

	return exp;
};