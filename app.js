var express = require('express')
  , routes = require('./routes')
  , main = require('./routes/main')
  , group_select = require('./routes/group_select')
  , meeting = require('./routes/meeting')
  , meeting_list = require('./routes/meeting_list')
  , meeting_planning = require('./routes/meeting_planning')
  , quick_meeting = require('./routes/quick_meeting')
  , tools = require('./routes/tools')
  , http = require('http')
  , path = require('path')
  , expressValidator = require('express-validator');

var app = express();

var _upload_dir = 'tmp';

var validator_option = {
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root    = namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('keyboard cat'));
	app.use(express.session());
	app.use(app.router);
	app.use(expressValidator(validator_option));
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
	app.use('/' + _upload_dir, express.static(path.join(__dirname, _upload_dir)));	// 업로드 디렉토리 static 등재
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', main.main);
app.get('/page/group_select', group_select.group_select); // 회의 선택 페이지
app.get('/page/meeting_list', meeting_list.meeting_list); // 회의 선택 페이지
app.get('/page/meeting', meeting.main); // 회의 진행 페이지
app.get('/page/meeting_public', meeting.meeting_public);
app.get('/page/meeting_appraisal', meeting.meeting_appraisal); // 회의 평가 페이지
app.get('/page/meeting_evaluation', meeting.meeting_evaluation); // 회의 평가 페이지
app.get('/page/meeting_result', meeting.meeting_result); // 회의 결과 페이지
app.get('/page/quick_meeting', quick_meeting.quick_meeting); // 빠른 회의 시작
app.get('/page/meeting_template', meeting_planning.meeting_template); // 회의 템플릿
app.get('/page/setting_agenda', meeting_planning.setting_agenda); // 회의 기획
app.get('/page/setting_agenda_step', meeting_planning.setting_agenda_step); // 회의 상세 기획
app.get('/page/ft_help', meeting.ft_help); // 퍼실리테이션 도움말
app.get('/page/minutes', meeting.minutes); // 회의록 페이지

/* post */
app.post('/ajax/set_meeting_planning', meeting_planning.set_meeting_planning);
app.post('/page/login', main.login);
app.post('/page/sign_up', main.sign_up);
app.post('/page/check_email', main.check_email);
app.post('/page/new_group', group_select.new_group);
app.post('/page/meeting_save', meeting.meeting_save);
app.post('/page/meeting_appraisal', meeting.post_meeting_appraisal);
app.post('/page/meeting_evaluation', meeting.post_meeting_evaluation);
app.post('/page/meeting_close', meeting.post_meeting_close);
app.post('/page/search_user', meeting_list.post_search_user);
app.post('/page/add_user', meeting_list.post_set_add_user);
app.post('/page/user_info', meeting_list.post_user_info);
app.post('/page/delete_user', meeting_list.post_set_delete_user);
app.post('/page/save_tools_image', meeting.meeting_save_tools_image);
app.post('/page/get_tools_image', meeting.result_get_tools_image);


/* 도구 관련 */
app.get('/tool/list/:group_id/:tool_index', tools.list);
app.get('/tool/postit/:group_id/:tool_index', tools.postit);
app.get('/tool/mindmap/:group_id/:tool_index', tools.mindmap);
app.get('/tool/vote/:group_id/:tool_index', tools.vote);
app.get('/tool/matrix/:group_id/:tool_index', tools.matrix);

app.post('/lib/upload', function(req, res) {
	console.log(JSON.stringify(req.files)); 
	console.log('serverPath : ' + targetPath);
 	
  	var fs = require('fs');
 	var util = require('util');
 
    var serverPath = '/' + _upload_dir + '/' + req.files.uploadFile.name;	
 	var targetPath = path.join(__dirname, serverPath);

	var is = fs.createReadStream(req.files.uploadFile.path);
	var os = fs.createWriteStream(targetPath);
	
	util.pump(is, os, function() {
	    fs.unlinkSync(req.files.uploadFile.path);
	    res.send({
            filename: req.files.uploadFile.name,
            filetype: req.files.uploadFile.type
		});
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server is started to listen on port " + app.get('port'));
});