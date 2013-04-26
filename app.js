
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , main = require('./routes/main')
  , meeting = require('./routes/meeting')
  , quick_meeting = require('./routes/quick_meeting')
  , meeting_planning = require('./routes/meeting_planning')
  , http = require('http')
  , path = require('path');

var app = express();

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
});

app.configure('development', function(){
  app.use(express.errorHandler());
});



app.get('/a', function(req, res){
console.log(req.session);
  var body = '';
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
    body += '<p>First time visiting? view this page in several browsers :)</p>';
  }
  res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});

app.get('/page/login', main.main);
app.get('/', routes.meeting_list);
app.get('/page/meeting', meeting.main);
app.get('/page/quick_meeting', quick_meeting.quick_meeting);
app.get('/page/meeting_template', meeting_planning.meeting_template);
app.get('/page/setting_agenda', meeting_planning.setting_agenda);
app.get('/page/setting_agenda_step', meeting_planning.setting_agenda_step);

app.post('/ajax/set_meeting_planning', meeting_planning.set_meeting_planning);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
