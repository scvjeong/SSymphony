/*
 * GET select_meeting_template
 */
var mysql_conn = require('../sql/mysql_server').mysql_conn;
var util = require('../lib/util');
var EventEmitter = require('events').EventEmitter;


exports.set_meeting_planning = function(req, res){
	var evt = new EventEmitter();
	var dao_c = require('../sql/common');
	var dao_mp = require('../sql/meeting_planning');
	var post = util.regroup_post(req.body);
	var unit_cnt = 0;
	// 트랜젝션 실행
	dao_c.dao_begin_work(evt, mysql_conn);

	// 트랜젝션 실행 후
	evt.on('begin_work', function(err, rows){
		if(err) throw err;

		// unit 쿼리 실행 - Insert meeting_planning
		dao_mp.dao_set_meeting_planning(evt, mysql_conn, post[0]);

		evt.on('query_unit_1', function(err, rows){
			if(err)
				dao_c.dao_rollback(evt, mysql_conn);
			else
			{
				// unit 쿼리 실행 - Insert agenda
				for( var i=0; i<post.length; i++ )
				{
					// set order 
					post[i]['order'] = (i+1);
					dao_mp.dao_set_meeting_planning_agenda(evt, mysql_conn, post[i]);
				}
				evt.on('query_unit_2', function(err, rows){
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
			}
		});

		evt.on('rollback', function(err, rows){
			if(err) throw err;
			res.render('ajax/set_meeting_planning', {result:"failed"} );
		});
	});
};

exports.meeting_template = function(req, res){
	var evt = new EventEmitter();
	var dao_mp = require('../sql/meeting_planning');
	// params['idx_owner']
	// params['idx_owner_type']
	var params = { idx_owner:null, idx_owner_type:null }
	dao_mp.dao_meeting_template(evt, mysql_conn, params);
	evt.on('meeting_template', function(err, rows){
		if(err) throw err;
		res.render('select_meeting_template', {result:rows} );
	});
};

exports.setting_agenda = function(req, res){
	var evt = new EventEmitter();
	var dao_mp = require('../sql/meeting_planning');
	// params['idx_owner']
	// params['idx_owner_type']
	// params['idx_meeting_planning']
	var params = { idx_owner:null, idx_owner_type:null, idx_meeting_planning:req.param('idx') }
	dao_mp.dao_load_agenda(evt, mysql_conn, params);
	evt.on('setting_agenda', function(err, rows){
		if(err) throw err;
		res.render('setting_agenda', {result:rows} );
	});
};

exports.setting_agenda_step = function(req, res){
	res.render('setting_agenda_step');
};

