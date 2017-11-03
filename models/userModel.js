var	appModel = require('./appModel');

var user = {
	getByLoginPass : function(username, password, res) {
		var qry = "SELECT * from user_admin where username = '" + username + "' AND password ='" + password + "'";
		appModel.ctPool.query(qry, function(err, result) {
			res(err, result);
		});
	}
}

module.exports = user 