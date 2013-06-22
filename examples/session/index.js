
// first:
// $ npm install redis
// $ redis-server

var express = require('express');

var app = express();

app.use(express.logger('dev'));

// Required by session() middleware
// pass the secret for signed cookies
// (required by session())
app.use(express.cookieParser('keyboard cat'));

// Populates req.session
app.use(express.session());

app.get('/', function(req, res){
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

app.listen(4000);
console.log('Express app started on port 4000');
