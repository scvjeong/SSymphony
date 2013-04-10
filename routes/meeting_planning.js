/*
 * GET select_meeting_template
 */
var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;

function regroup_post( post )
{
	var keys = Object.keys( post );
	var arr = new Array;
	if( keys.length > 0 )
	{
		var len = post[keys[0]].length;
		for(var i=0; i<len; i++)
		{
			arr[i] = {};
			for(var j=0; j<keys.length; j++)
				arr[i][keys[j]] = post[keys[j]][i];
		}
	}
	return arr;
}

exports.set_meeting_planning = function(req, res){
	var evt = new EventEmitter();
	var dao_c = require('../sql/common');
	var dao_mp = require('../sql/meeting_planning');
	var post = regroup_post(req.body);
	var unit_cnt = 0;
	// 트랜젝션 실행
	dao_c.dao_begin_work(evt, mysql_conn);

	// 트랜젝션 실행 후
	evt.on('begin_work', function(err, rows){
		if(err) throw err;
		// unit 쿼리 실행
		for( var i=0; i<post.length; i++ )
			dao_mp.dao_set_meeting_planning(evt, mysql_conn, post[i]);
		
		evt.on('query_unit', function(err, rows){
			if(err) throw err;
			unit_cnt++;
			if( post.length == unit_cnt )
			{
				// 트랜젝션 커밋 실행
				dao_c.dao_commit(evt, mysql_conn);
				// 트랜젝션 커밋 실행 후
				evt.on('commit', function(err, rows){
					if(err) throw err;
					res.render('ajax/set_meeting_planning', {result:"successful"} );
				});
			}
		});
	});

	/*
	// error flag
	var err_flag = false;
	// complete flag
	var c_flag = new Array;
	for( var i=0; i<post.length; i++ )
	{
		c_flag[i] = false;
		post[i]['order'] = (i+1);
		var query = mysql_conn.query(sql, post[i], function(err, rows, fields) {
			evt.emit('query_unit', err, rows);
			if( err ) 
				err_flag = true;
			else
			{
				for(var j=0;j<c_flag.length;j++)
				{
					if( c_flag.length == (j+1) ) 
						res.render('ajax/set_meeting_planning', {result:err_flag} );
					else if( c_flag[j] == false )
					{	
						c_flag[j] = true; 
						break;
					}
				}
			}
		});
	}
	*/
};

exports.meeting_template = function(req, res){
	var model = require('../sql/meeting_planning');
	var sql = model.sql_meeting_template(null,null);
	mysql_conn.query(sql, function(err, rows, fields) {
		if (err) throw err;
		res.render('select_meeting_template', {result:rows} );
	});
};

exports.setting_agenda = function(req, res){
	var model = require('../sql/meeting_planning');
	var sql = model.sql_load_agenda(null,null, 1);
	mysql_conn.query(sql, function(err, rows, fields) {
		if (err) throw err;
		res.render('setting_agenda', {result:rows} );
	});
};

exports.setting_agenda_step = function(req, res){
	res.render('setting_agenda_step');
};

