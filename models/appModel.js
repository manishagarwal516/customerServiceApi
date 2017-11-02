var yaml = require("js-yaml"),
	fs = require("fs"),
	e = yaml.load(fs.readFileSync("config/database.yml")),
	pg = require('pg'),
	types = require('pg').types,
	envVar = process.env.NODE_ENV,
	ctConString = "postgres://" + e[envVar].username + ":" + e[envVar].password + "@" + e[envVar].host + ":" + e[envVar].port + "/" + e[envVar].database;

var ctPool = {
	query: function(qry,res){
		console.log('Query: ' + qry);
		//var client = new pg.Client(ctConString);
		pg.connect(ctConString, function(err, client, done) {
			if (err) {
				console.log('Could not connect to postgress: ' + err);
				res(err);
				return;
			}
			client.query(qry, function(err, result) {
				if (err) {
					console.log('Query error.',err);
					res('Query error in ctPool.');
				}
				else {
					res(err, result.rows);
				}
				done();
			});
		});
	},
	insert: function(data, res){
		var qry = queryBuilder('insert', data);
		console.log('Insert: ' + qry);
		//var client = new pg.Client(ctConString);
		pg.connect(ctConString, function(err, client, done) {
			if (err) {
				console.log('Could not connect to postgress: ' + err);
				res(err);
				return;
			}
			client.query(qry, function(err, result) {
				if (err) {
					console.log('Query Insert error for qry: ' + qry);
				}
				var r = {};
				if (result && result.fields.length > 0) {
					var primary_key = result.fields[0].name;
					r = {
						insertId: result.rows[0][primary_key]
					};
				}
				res(err, r);
				done();
			});
		});
	},
	update: function(data, res){
		var qry = queryBuilder('update', data);
		console.log('Update: ' + qry);
		//var client = new pg.Client(ctConString);
		pg.connect(ctConString, function(err, client, done) {
			if (err) {
				console.log('Could not connect to postgress: ' + err);
				res(err);
				return;
			}
			client.query(qry, function(err, result) {

				if (err) {
					console.log('Query Update error.');
				}
				res(err, result);
				done();
			});
		});
	},
};

module.exports = {
	ctPool: ctPool
};

function queryBuilder(type,data){
	var qry = '';
	switch(type){
		case 'insert':
			var fields = [];
			var values = '';
			var count = 0;
			for (var key in data.values) {
				count ++;
				fields.push(key);
				var val = data.values[key];

				if (val === 'CURRENT_TIMESTAMP' || val === 'NOW()' || val === 'NOT NULL') {
					values += val;
				} else if (val === '' || val === 'null' || val === 'NULL' || val === null) {
					values += 'NULL';
				} else if (typeof val === 'string') {
					if (val.indexOf("'") >= 0) {
						val = val.replace(/'/g, "''"); // escape single quotes
					}
					values += "'" + val + "'";
				} else {
					values += val;
				}
				if (count < Object.keys(data.values).length) {
					values += ",";
				}
			}
			console.log(data);
			qry = "INSERT INTO " + data.table + " (" + fields.join(',') + ") VALUES (" + values + ")";
		break;

		case 'update':
			var set = [];
			for (var field in data.values) {
				if (field === data.table + '_id' || field === 'id') { continue; } // skip primary key
				var val = data.values[field];
				var str = field + " = ";
				if (typeof val === 'string') {
					if (val === 'CURRENT_TIMESTAMP' || val === 'NOW()' || val === 'NOT NULL') {
						str += val;
					} else if (val === '' || val === 'null' || val === 'NULL' || val === null) {
						str += 'NULL';
					} else {
						if ((val).indexOf("\'") > -1) {
							val = (val).replace(/\'/g, "''"); // escape single quotes
						} else if ((val).indexOf("'") > -1) {
							val = (val).replace(/'/g, "''"); // escape single quotes
						}
						str += "'"+val+"'";
					}
				} else {
					str += val;
				}
				set.push(str);
			}
			qry = "UPDATE " +  data.table + " SET " + set.join(',')+(data.where ? data.where : " WHERE " + data.table + "_id = " + data.values[data.table + '_id']);
		break;
	}
	return qry;
}