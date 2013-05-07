var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;

var _COMPLETE_FLAG_CNT = 1;

exports.main = function(req, res){
	/** session start **/
	if( !req.session.email || !req.session.email.length )
		res.redirect("/");
	/** session end **/

	res.render('meeting', { title: 'Express' });
};

exports.appraisal = function(req, res){
	/** session start **/
	if( !req.session.email || !req.session.email.length )
		res.redirect("/");
	/** session end **/

	res.render('appraisal', { title: 'Express' });
};

exports.result = function(req, res){
	/** session start **/
	//if( !req.session.email || !req.session.email.length )
	//	res.redirect("/");
	/** session end **/

	var evt = new EventEmitter();
	var dao_c = require('../sql/common');
	var dao_m = require('../sql/meeting');
	var params = {};
	var result = { meeting_result:{} };
	var complete_flag = 0;

	dao_m.dao_get_meeting_result(evt, mysql_conn, params);
	evt.on('get_meeting_result', function(err, rows){
		if(err) throw err;
		result.meeting_result = rows;
		console.log(rows);
		complete_flag++;
		if( complete_flag === _COMPLETE_FLAG_CNT )
			res.render('meeting_result', {result:result} );
	});
};