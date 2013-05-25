var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;

exports.main = function(req, res){
	res.render('main', {} );
};

exports.login = function(req, res){
	var evt = new EventEmitter();
	var dao_m = require('../sql/main');
	// params['id']
	// params['pw']
	var params = { id:req.body.email, pw:req.body.pass }

	dao_m.dao_login(evt, mysql_conn, params);
	evt.on('login', function(err, rows){
		if(err) throw err;
		if( rows.length < 1 )
		{
			res.redirect("/?status=failed");
		}
		else
		{
			req.session.email = rows[0].id;
			req.session.nickname = rows[0].name;
			res.redirect("/page/meeting_list");
		}
	});
};

exports.group_select = function(req, res){
	var evt = new EventEmitter();
	res.render('group_select', { title: '' });
};