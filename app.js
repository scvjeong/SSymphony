var express = require('express')
  , routes = require('./routes')
  , main = require('./routes/main')
  , meeting = require('./routes/meeting')
  , quick_meeting = require('./routes/quick_meeting')
  , meeting_planning = require('./routes/meeting_planning')
  , tools = require('./routes/tools')
  , http = require('http')
  , path = require('path');

var app = express();

var _upload_dir = 'tmp';

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
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
	app.use('/' + _upload_dir, express.static(path.join(__dirname, _upload_dir)));	// 업로드 디렉토리 static 등재
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', main.main);
app.get('/page/meeting_list', routes.meeting_list); // 회의 선택 페이지
app.get('/page/meeting', meeting.main); // 회의 진행 페이지
app.get('/page/meeting_public', meeting.meeting_public);
app.get('/page/meeting_appraisal', meeting.meeting_appraisal); // 회의 평가 페이지
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
app.post('/page/meeting_save', meeting.meeting_save);
app.post('/page/meeting_appraisal', meeting.post_meeting_appraisal);

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