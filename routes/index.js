var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;
/*
 * GET home page.
 */

exports.meeting_list = function(req, res){
	console.log( req.session );
	/** session start **/
	if( !req.session.email || !req.session.email.length )
		res.redirect("/");
	/** session end **/

	var evt = new EventEmitter();
	var dao_ml = require('../sql/meeting_list');
	var dao_gi = require('../sql/group_info');
	var dao_h = require('../sql/help');
	// params['idx_user']
	// params['idx_group']
	var params = { idx_user:1, idx_group:1 }

	var result = { meeting:{}, users:{}, help:{} };
	var complete_flag = 0;

	dao_ml.dao_meeting_list(evt, mysql_conn, params);
	evt.on('meeting_list', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.meeting = rows;
		if( complete_flag == 3 )
			res.render('meeting_list', {result:result} );
	});

	dao_gi.dao_group_info_member(evt, mysql_conn, params);
	evt.on('group_info_member', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.users = rows;
		if( complete_flag == 3 )
			res.render('meeting_list', {result:result} );
	});

	dao_h.dao_help(evt, mysql_conn, params);
	evt.on('help', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.help = rows;
		if( complete_flag == 3 )
			res.render('meeting_list', {result:result} );
	});
};