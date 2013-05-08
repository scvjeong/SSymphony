var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;

exports.list = function(req, res){
	console.log("get list tool");
	
	res.render('tools/list/list', { title: 'Express' });
};
