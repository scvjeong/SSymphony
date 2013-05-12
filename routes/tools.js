var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;
    
    
exports.list = function(req, res) {
	var group_id = req.params.group_id;
	var tool_index = req.params.tool_index;
	
	console.log(req.params);

//	res.render('tools/list', { title: 'Express' });
	res.render('tools/list',
		{
			group_id: group_id,
			tool_index: tool_index
		}
	);
};

exports.postit = function(req, res) {
	res.render('tools/postit', { title: 'Express' });
};

exports.mindmap = function(req, res) {
	res.render('tools/mindmap', { title: 'Express' });
};

exports.vote = function(req, res) {
	res.render('tools/vote', { title: 'Express' });
};

exports.matrix = function(req, res) {
	res.render('tools/matrix', { title: 'Express' });
};
