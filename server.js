var debug = require('debug')('smaps');

var express = require('express');
var app = express();
var server = require('http').Server(app);

var bodyParser = require('body-parser');
var multer  = require('multer')
var compression = require('compression')
var upload = multer({dest:'./uploads/'}).single('file');

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(express.static('public'));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload);
app.use(require('morgan')('combined'));

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Nah...');
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ');
  console.log(err.stack);
});

var routerIndex = require('./routes/routerIndex')(express);
var routerTizen = require('./routes/routerTizen')(express);
var routerAndroid = require('./routes/routerAndroid')(express);
app.use('/', routerIndex);
app.use('/tizen', routerTizen);
app.use('/android', routerAndroid);

server.listen(8888, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('smaps listening at http://%s:%s', host, port);
});
