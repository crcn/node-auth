var Worker = require("worker");

exports.init = function(options) {
	var connection = options.connection,
	worker = new Worker(options);


	return {
		worker: worker
	};
}