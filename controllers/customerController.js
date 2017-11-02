var	customerModel = require('../models/customerModel'),
	controller = require('./appController');

var customer = {
	getAction: function(req, res) {
		console.log(req.query);
		customerModel.getAction(req.query, function(err, data){
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	},

	postAction: function(req, res) {
		customerModel.postAction(req.body, function(err, data){
			console.log(data);
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	},

	putAction: function(req, res) {
		customerModel.putAction(req.body, req.params.id, function(err, data){
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	},

	getCustomerDetail: function(req, res) {
		console.log(req.params);
		customerModel.getCustomerDetail(req.params, function(err, data){
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	},

	getCustomerOrders: function(req, res) {
		console.log(req.params);
		customerModel.getCustomerOrders(req.body, function(err, data){
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	}
}

module.exports = customer 