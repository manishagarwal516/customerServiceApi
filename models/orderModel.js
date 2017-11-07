var	appModel = require('./appModel'),
	_ = require('underscore'),
	async = require('async');

var order = {
	getAction : function(data, res) {
		var qryArray = order.createQuery(data);
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
						var orders = [];
						_.map(_.groupBy(data, function(res){ return res.customer_id; }), function(order, key){
							var tempHash = {
								"id": order[0].customer_id,
								"name": order[0].customer_name,
								"orders": order,
								"order_total": _.reduce(order, function(memo, val){ return memo + val.item_price; }, 0)
							}
							orders.push(tempHash);
						})
						var orderData = {};
						orderData.records = orders;
						orderData.count = totalCount[0].count;
						callback(null, orderData);
					}
				});
			}
		],function(err,result){
			if(err)
				res(null);
			else
				res(err, result);
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
		var limit = 5, 
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
		var orderCountQuery = "SELECT count(DISTINCT cu.customer_id) from customer cu JOIN shipment sh ON (sh.customer_id = cu.customer_id)";	
		return [selectDataQry,orderCountQuery];
	}
}

module.exports = order 