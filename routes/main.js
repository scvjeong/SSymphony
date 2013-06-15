var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;
var Validator = require('validator').Validator;
var crypto = require('crypto');
var nodemailer = require("nodemailer");

function register_session(req, idx_user, id, first_name, last_name)
{
	req.session.idx_user = idx_user;
	req.session.email = id;
	req.session.nickname = first_name + " " + last_name;
}

exports.jeong = function(req, res){
	var agent = req.headers['user-agent'];
	if( agent.toString().indexOf("MSIE") > 0 )
	{
		res.render('no_explorer', {} );
		return;
	}
	
	res.render('jeong', {} );
};

exports.main = function(req, res){
	var agent = req.headers['user-agent'];
	if( agent.toString().indexOf("MSIE") > 0 )
	{
		res.render('no_explorer', {} );
		return;
	}
	
	res.render('main', {} );
};

exports.mail_auth = function(req, res){
	var evt = new EventEmitter();
	var dao_m = require('../sql/main');
	var code = req.params.code;
	var params = { code:code };

	dao_m.dao_check_code(evt, mysql_conn, params);
	evt.on('check_code', function(err, rows){
		if( rows[0] )
		{
			params.id = rows[0].id;
			params.idx = rows[0].idx;
			params.first_name = rows[0].first_name;
			params.last_name = rows[0].last_name;
			dao_m.dao_mail_auth(evt, mysql_conn, params);		
		}
		else
			res.redirect("/");
	});
	evt.on('mail_auth', function(err,rows){
		register_session(req, params.idx, params.id, params.first_name, params.last_name);
		res.redirect("/page/group_select");
	});
};

function sendMail(email, code)
{
	var smtpTransport = nodemailer.createTransport("Sendmail");
	var html = "Hello!<p>";
	html += "Welcome to Orchestra<p>";
	html += "To complete your registration, click or copy the link below:<p>";
	html += "Click here : <a href='http://orchestra.im/auth/"+code+"'>http://orchestra.im/auth/"+code+"</a>";
	var mailOptions = {
		from: "Orchestra ✔ <SignUp@orchestra.im>", // sender address
		to: email, // list of receivers
		subject: "Please confirm your new Orchestra account ✔", // Subject line
		html: html // html body
	}
	smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
			console.log(error);
		}else{
			console.log("Message sent: " + response.message);
		}
	});
}

exports.login = function(req, res){
	var evt = new EventEmitter();
	var dao_m = require('../sql/main');
	var referer = req.headers.referer;
	var referer_facebook = (referer === "http://orchestra.com:3000/auth/facebook?type=login" || referer === "http://orchestra.im/auth/facebook?type=login" || referer === "http://lyd.orchestra.im:3000/auth/facebook?type=login");
	var id = req.param("email");
	var pass = req.param("pass");
	var fb_key = req.param("fb_key");
	// params['id']
	// params['pw']
	var params = { 
		id:id, 
		pw:pass 
	}


	dao_m.dao_login(evt, mysql_conn, params);
	evt.on('login', function(err, rows){
		if(err) throw err;
		if( rows.length < 1 )
			res.redirect("/?status=failed");
		else if( rows[0].status === "N" )
		{
			sendMail(rows[0].id, rows[0].code);
			res.redirect("/?status=auth");
		}
		else if( referer_facebook && req.session.fb_key === fb_key )
		{
			register_session(req, rows[0].idx, rows[0].id, rows[0].first_name, rows[0].last_name);
			res.redirect("/page/group_select");
		}
		else if( rows[0].type === "facebook" )
		{
			crypto.randomBytes(48, function(ex, buf) {
				var token = buf.toString('hex');
				req.session.fb_key = token;
				req.session.fb_id = id;
				res.redirect("/auth/facebook?type=login");
			});
		}
		else if( rows[0].pw !== rows[0].input_pw )
			res.redirect("/?status=failed");
		else if( rows[0].pw === rows[0].input_pw )
		{
			register_session(req, rows[0].idx, rows[0].id, rows[0].first_name, rows[0].last_name);
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
	var referer = req.headers.referer;
	var referer_facebook = (referer === "http://orchestra.com:3000/auth/facebook" || referer === "http://orchestra.im/auth/facebook" || referer === "http://lyd.orchestra.im:3000/auth/facebook");
	var type, code;

	req.checkBody("first_name", "You can't leave this empty.").notEmpty();
	req.checkBody("last_name", "You can't leave this empty.").notEmpty();
	req.checkBody("sign_up_email", "You can't leave this empty.").notEmpty();
	req.checkBody("sign_up_email", "Please enter a valid email").isEmail();
	if( referer_facebook )
		type = "facebook";
	else
	{
		type = "origin";
		req.checkBody("sign_up_password", "You can't leave this empty.").notEmpty();
		req.checkBody("sign_up_re_password", "These passwords don't match. Try again?").equals(sign_up_password);
	}

	var errors = req.validationErrors();
	if( errors !== null )
	{
		result = errors[0];
		res.send(result);
	}
	else
	{
		// params['id']
		var params = { 	id:sign_up_email }
		dao_m.dao_check_email(evt, mysql_conn, params);
	}

	evt.on('check_email', function(err, rows){
		if( rows[0].cnt === 0 )
		{
			crypto.randomBytes(48, function(ex, buf) {
				code = buf.toString('hex');
				// params['id']
				// params['pw']
				// params['first_name']
				// params['last_name']
				var params = {
						id:sign_up_email,
						pw:sign_up_password,
						first_name:first_name,
						last_name:last_name,
						type:type,
						code:code
				};
				dao_m.dao_sign_up(evt, mysql_conn, params);
			});
		}
		else
		{
			result = { result:"failed", msg:"Someone already has that username. Try another?", target:"sign_up_email" };
			res.send(result);
		}
	});

	evt.on('sign_up', function(err, rows){
		var idx_user = rows.insertId;
		//register_session(req, idx_user, sign_up_email, first_name, last_name);
		sendMail(sign_up_email, code);
		result = { result:"successful", msg:"successful" };
		res.send(result);
	});
};

exports.check_email = function(req, res){
	var evt = new EventEmitter();
	var dao_m = require('../sql/main');
	var result = {};
	var sign_up_email = req.body.sign_up_email;

	req.checkBody("sign_up_email", "You can't leave this empty.").notEmpty();
	req.checkBody("sign_up_email", "Please enter a valid email").isEmail();
	var errors = req.validationErrors();
	if( errors === null )
	{
		// params['id']
		var params = { id:sign_up_email }
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
	{
		result = errors[0];
		res.send(result);
	}
}

exports.channel = function(req, res){
	res.render('channel', {} );
};
exports.facebook = function(req, res){
	var type = req.param("type");
	var result = {
		type:type,
		fb_key:req.session.fb_key
	}
	res.render('facebook', {result:result} );
};
exports.facebook_callback = function(req, res){
	var evt = new EventEmitter();
	var dao_m = require('../sql/main');
	var result = {};
	var code = req.param("code");
	res.redirect("/auth/facebook");
	//console.log(code);
	/*
	var signed_request = req.param("signed_request").toString().split(".");
	var sig, result, email, name, first_name, last_name;
	for(var i=0;i<signed_request.length;i++)
	{
		sig = new Buffer(signed_request[i], 'base64').toString('ascii');
		if( sig.substring(0,1) === "{" )
		{
			result = JSON.parse(sig);
			email = result.registration.email;
			name = result.registration.name.toString().split(" ");
			if( name[0] ) first_name = name[0]; else first_name = "";
			if( name[1] ) last_name = name[1]; else last_name = "";
			// params['id']
			// params['pw']
			// params['first_name']
			// params['last_name']
			var params = {
					id:email,
					pw:"o!r@c)h(e*s&t^r%a$",
					first_name:first_name,
					last_name:last_name,
					type:"facebook"
				};
			dao_m.dao_sign_up(evt, mysql_conn, params);
		}
	}
	evt.on('sign_up', function(err, rows){
		var idx_user = rows.insertId;
		register_session(req, idx_user, email, first_name, last_name);
		res.redirect("/page/group_select");
	});
	*/
};
exports.facebook_callback_login = function(req, res){
	var evt = new EventEmitter();
	var dao_m = require('../sql/main');
	var result = {};
	var code = req.param("code");
	res.redirect("/auth/facebook?type=login");
};