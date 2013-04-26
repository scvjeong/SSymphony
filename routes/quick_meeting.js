/*
 * GET select_meeting_template
 */
var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;

exports.quick_meeting = function(req, res){
	/** session start **/
	req.session.id = "scvjeong";
	req.session.nickname = "Dream Supporter";
	if( req.session.id.length < 1 )
		res.redirect("/page/login");
	/** session end **/

	var evt = new EventEmitter();
	var dao_qm = require('../sql/quick_meeting');
	dao_qm.dao_quick_meeting(evt, mysql_conn, null);
	evt.on('quick_meeting', function(err, rows){
		if(err) throw err;
		res.render('quick_meeting', {result:rows} );
	});
};

