var	orderModel = require('../models/orderModel'),
	controller = require('./appController');

var order = {
	getAction: function(req, res) {
		console.log(req.query);
		orderModel.getAction(req.body, function(err, data){
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	},

	postAction: function(req, res) {
		console.log(req.query);
		orderModel.postAction(req.body, function(err, data){
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	}
}

module.exports = order 