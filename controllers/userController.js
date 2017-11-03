var token = require('../lib/token.js'),
	controller = require('./appController');
var user = {
	logout: function(req, res) {
		token.deleteAccess(req.body.access_token, function(err, data){
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	}
}

module.exports = user 