var	appModel = require('./appModel'),
	_ = require('underscore'),
	async = require('async');

var customer = {
	getAction : function(data, res) {
		var qryArray = customer.createQuery(data);
		async.waterfall([
			function(callback) {
				appModel.ctPool.query(qryArray[0], function(err, result) {
					if(err)
						callback(err);
					else
						callback(null, result);
				});
			},
			function(data, callback) {
				appModel.ctPool.query(qryArray[1], function(err, totalCount) {
					console.log(totalCount);
					if(err)
						callback(err);
					else{
						var customerData = {};
						customerData.records = data;
						customerData.count = totalCount[0].count;
						callback(null, customerData);
					}
				});
			}
		],function(err,result){
			if(err)
				res(null);
			else
				res(err, result);
		});		
		// appModel.ctPool.query(customer.createQuery(data), function(err, result) {
		// 	res(err, result);
		// });
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
		var selectDataQry = "SELECT customer.*, st.name as state_name from customer "
		selectDataQry += "JOIN state st ON (st.state_id = customer.state_id)"
		selectDataQry += "where customer_id ="+ data.id;
		appModel.ctPool.query(selectDataQry, function(err, result) {
			res(err, result);
		});
	},

	getCustomerOrders : function(data, res) {
		var selectDataQry = "SELECT cu.customer_id, concat(cu.first_name, ' ', cu.last_name) AS customer_name ,"
			selectDataQry += "(sh.qry * it.item_price) as item_price, it.name as item_name "
			selectDataQry += "from customer cu "
			selectDataQry += "JOIN shipment sh ON (sh.customer_id = cu.customer_id) "
			selectDataQry += "JOIN item it ON (it.item_id = sh.item_id) "
			selectDataQry += "WHERE cu.customer_id = " + data.id;
			selectDataQry += "GROUP BY cu.customer_id, sh.shipment_id, it.item_id ";
		appModel.ctPool.query(selectDataQry, function(err, result) {
			if(err) 
				return res(err);
			var orders = [];
			_.map(_.groupBy(result, function(res){ return res.customer_id; }), function(customerOrder, key){
				var tempHash = {
					"id": customerOrder[0].customer_id,
					"name": customerOrder[0].customer_name,
					"orders": customerOrder,
					"order_total": _.reduce(customerOrder, function(memo, order){ return memo + order.item_price; }, 0)
				}
				orders.push(tempHash);
			})
			res(err, orders);
		});
	},

	createQuery : function(data){
		var limit = 5, 
			where = '', 
			offset = data.page ? (data.page - 1) * limit : 0;
		_.each(filter_keys[data.filter_key], function(value, index){
			where +=  value + " ILIKE '%" + data.filter + "%' " + (index === (filter_keys[data.filter_key].length - 1) ? "" : "OR ");
		})
		var whereQry = data.filter && data.filter_key ? "WHERE " + where  : ""
		var selectDataQry = "SELECT customer.*, st.name as state_name from customer "
		selectDataQry += "JOIN state st ON (st.state_id = customer.state_id)"
		selectDataQry += whereQry +" LIMIT " + limit + " offset " + offset;
		var totalCountQuery = "SELECT count(*) from customer "+ whereQry;
		return [selectDataQry, totalCountQuery];
	}

}
var filter_keys = {
	customer_name: ["customer.first_name","customer.last_name"]
}
module.exports = customer 