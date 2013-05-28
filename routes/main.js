var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;
var Validator = require('validator').Validator;

// validator
var v = new Validator();
v.error = function(target) {
	var msg = "";
	switch(target)
	{
		case "sign_up_email":
			msg = "Please enter a valid email";
			break;
	}
	result = { result:"failed", msg:msg, target:target };
}

function register_session(req, idx_user, id, first_name, last_name)
{
	req.session.idx_user = idx_user;
	req.session.email = id;
	req.session.nickname = first_name + " " + last_name;
}

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
			register_session(req, rows[0].idx_user, rows[0].id, rows[0].first_name, rows[0].last_name);
			res.redirect("/page/group_select");
		}
	});
};

exports.sign_up = function(req, res){
	var evt = new EventEmitter();
	var dao_m = require('../sql/main');
	var result = {};
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var sign_up_email = req.body.sign_up_email;
	var sign_up_password = req.body.sign_up_password;
	var sign_up_re_password = req.body.sign_up_re_password;
	
	v.check(sign_up_email, "sign_up_email").isEmail();

	if( first_name.length < 1 )
		result = { result:"failed", msg:"You can't leave this empty.", target:"first_name" };
	else if( last_name.length < 1 )
		result = { result:"failed", msg:"You can't leave this empty.", target:"last_name" };	
	else if( sign_up_email.length < 1 )
		result = { result:"failed", msg:"You can't leave this empty.", target:"sign_up_email" };
	else if( sign_up_password.length < 1 )
		result = { result:"failed", msg:"You can't leave this empty.", target:"sign_up_password" };
	else if( sign_up_password !== sign_up_re_password )
		result = { result:"failed", msg:"These passwords don't match. Try again?", target:"sign_up_re_password" };

	if( result.result !== "failed" )
	{
		// params['id']
		var params = { id:sign_up_email }
		dao_m.dao_check_email(evt, mysql_conn, params);
	}
	else
		res.send(result);

	evt.on('check_email', function(err, rows){
		if( rows[0].cnt === 0 )
		{
			// params['id']
			// params['pw']
			// params['first_name']
			// params['last_name']
			var params = {
					id:sign_up_email,
					pw:sign_up_password,
					first_name:first_name,
					last_name:last_name
				};
			dao_m.dao_sign_up(evt, mysql_conn, params);
		}
		else
		{
			result = { result:"failed", msg:"Someone already has that username. Try another?", target:"sign_up_email" };
			res.send(result);
		}
	});

	evt.on('sign_up', function(err, rows){
		var idx_user = rows.insertId;
		register_session(req, idx_user, sign_up_email, first_name, last_name);
		result = { result:"successful", msg:"successful" };
		res.send(result);
	});
};

exports.check_email = function(req, res){
	var evt = new EventEmitter();
	var dao_m = require('../sql/main');
	var result = {};
	var email = req.body.email;

	v.check(email).isEmail();

	if( result.result !== "failed" )
	{
		// params['id']
		var params = { id:email }
		dao_m.dao_check_email(evt, mysql_conn, params);
		evt.on('check_email', function(err, rows){
			if( rows[0].cnt === 0 )
				result = { result:"successful", msg:"successful" };
			else
				result = { result:"failed", msg:"Someone already has that username. Try another?", target:"sign_up_email" };
			res.send(result);
		});
	}
	else
		res.send(result);
}
