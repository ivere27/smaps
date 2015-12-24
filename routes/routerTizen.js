var debug = require('debug')('smaps:routes:tizen');
var fs = require('fs');

var smaps = require('../lib/smaps');
var proc = require('../lib/proc');
var tizen = require('../lib/tizen');

module.exports = function(express) {
  var router = express.Router();

  router.get('/', function(req, res) {
    res.render('index', {apiPrefix : '/tizen'});
  });

  router.get('/proc/cmdline', function(req, res) {
    tizen.readProcCmdline(function(err,cmdline){
      if (err)
        return res.status(400).send('error : ' + err);

      res.send(cmdline);
    })
  });

  router.get('/smaps/:pid/raw', function(req, res) {
    var pid = req.params.pid;
    var rawStream = tizen.SmapsStream(pid);

    rawStream.on('error',function(err){
      res.status(400).send('error : ' + err);
      console.log(err);  
    });

    res.attachment('tizen_' + pid + '_smaps.txt');
    res.writeHead(200);

    rawStream.pipe(res);
  });

  router.get('/smaps/:pid/object', function(req, res) {
    var pid = req.params.pid;
    var rawStream = tizen.SmapsStream(pid);
    var smapsStream = smaps.SmapsTransformStream();

    rawStream.on('error',function(err){
      res.status(400).send('error : ' + err);
      console.log(err);  
    });

    rawStream.pipe(smapsStream);

    smapsStream.on('error',function(err){
      res.status(400).send('error : ' + err);
      console.log(err);  
    });
    smapsStream.on('finish',function(e){
      res.send(smapsStream.read());
    })
  });

  return router;
};