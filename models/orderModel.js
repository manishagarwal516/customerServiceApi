var	appModel = require('./appModel'),
	_ = require('underscore');

var order = {
	getAction : function(data, res) {
		appModel.ctPool.query(order.createQuery(data), function(err, result) {
			var orders = []
			_.map(_.groupBy(result, function(res){ return res.customer_id; }), function(val, key){
				var tempHash = {
					"id": val[0].customer_id,
					"name": val[0].customer_name,
					"orders": val
				}
				orders.push(tempHash);
			})
			console.log(orders);
			res(err, orders);
		});
	},

	postAction : function(data, res) {
		var insertData = {
			"table" : 'shipment',
			"values" : data
		}
		appModel.ctPool.insert(insertData, function(err, result) {
			res(err, result);
		})
	},

	createQuery : function(data){
		var limit = 20, 
			where = '', 
			offset = data.page ? (data.page - 1) * limit : 0;
		var whereQry = data.filter && data.filter_key ? "WHERE " + where  : ""
		var selectDataQry = "SELECT cu.customer_id, concat(cu.first_name, ' ', cu.last_name) AS customer_name ,"
			selectDataQry += "(sh.qry * it.item_price) as item_price, it.name as item_name "
			selectDataQry += "from customer cu "
			selectDataQry += "JOIN shipment sh ON (sh.customer_id = cu.customer_id) "
			selectDataQry += "JOIN item it ON (it.item_id = sh.item_id) "
			selectDataQry += "GROUP BY cu.customer_id, sh.shipment_id, it.item_id "
			selectDataQry += " LIMIT " + limit + " offset " + offset;
		return selectDataQry;
	}
}

module.exports = order 