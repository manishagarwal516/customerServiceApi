var	appModel = require('./appModel');

var state = {
	getAction : function(data, res) {
		var qry = "SELECT * from state";
		appModel.ctPool.query(qry, function(err, result) {
			res(err, result);
		});
	}
}

module.exports = state 