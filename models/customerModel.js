var	appModel = require('./appModel'),
	_ = require('underscore');

var customer = {
	getAction : function(data, res) {
		appModel.ctPool.query(customer.createQuery(data), function(err, result) {
			res(err, result);
		});
	},

	postAction : function(data, res) {
		var insertData = {
			"table" : 'customer',
			"values" : data
		}
		appModel.ctPool.insert(insertData, function(err, result) {
			res(err, result);
		})
	},

	putAction : function(data, customer_id, res) {
		var updateData = {
			"table" : 'customer',
			"values" : data,
			"where"  : "WHERE customer_id="+ customer_id
		}
		appModel.ctPool.update(updateData, function(err, result) {
			res(err, result);
		})
	},

	getCustomerDetail : function(data, res) {
		var selectDataQry = "SELECT * from customer where customer_id ="+ data.id;
		appModel.ctPool.query(selectDataQry, function(err, result) {
			res(err, result);
		});
	},

	getCustomerOrders : function(data, res) {
		res(null, "getCustomerOrders")
	},

	createQuery : function(data){
		var limit = 20, 
			where = '', 
			offset = data.page ? (data.page - 1) * limit : 0;
		_.each(filter_keys[data.filter_key], function(value, index){
			where +=  value + " ILIKE '%" + data.filter + "%' " + (index === (filter_keys[data.filter_key].length - 1) ? "" : "OR ");
		})
		var whereQry = data.filter && data.filter_key ? "WHERE " + where  : ""
		var selectDataQry = "SELECT *  from customer "+ whereQry +" LIMIT " + limit + " offset " + offset;
		return selectDataQry;
	}

}
var filter_keys = {
	customer_name: ["first_name","last_name"]
}
module.exports = customer 