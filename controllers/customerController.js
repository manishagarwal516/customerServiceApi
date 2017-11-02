var	customerModel = require('../models/customerModel'),
	controller = require('./appController');

var customer = {
	getAction: function(req, res) {
		console.log(req.query);
		customerModel.getAction(req.body, function(err, data){
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	}
}

module.exports = customer 