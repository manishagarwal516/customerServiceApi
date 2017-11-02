var	stateModel = require('../models/stateModel'),
	controller = require('./appController');

var customer = {
	getAction: function(req, res) {
		console.log(req.query);
		stateModel.getAction(req.body, function(err, data){
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	}
}

module.exports = customer 