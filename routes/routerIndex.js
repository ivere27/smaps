var debug = require('debug')('smaps:routes:index');
var fs = require('fs');

var smaps = require('../lib/smaps');
var proc = require('../lib/proc');

module.exports = function(express) {
  var router = express.Router();

  router.get('/', function(req, res) {
    res.render('index');
  });

  router.get('/proc/cmdline', function(req, res) {
    proc.readProcCmdline(function(err,cmdline){
      if (err)
        return res.status(400).send('error.');

      res.send(cmdline);
    })
  });

  router.get('/smaps/:pid/raw', function(req, res) {
    var pid = req.params.pid;
    var rawStream = fs.createReadStream('/proc/' + pid + '/smaps');

    rawStream.on('error',function(err){
      res.status(400).send('error : ' + err);
      console.log(err);  
    });

    res.attachment(pid + '_smaps.txt');
    res.writeHead(200);

    rawStream.pipe(res);
  });

  router.get('/smaps/:pid/object', function(req, res) {
    var pid = req.params.pid;
    var rawStream = fs.createReadStream('/proc/' + pid + '/smaps');
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

  router.post('/file', function(req, res) {
    debug(req.file);

    if (!req.file)
      return res.status(400).send('upload a file');

    var rawStream = fs.createReadStream(req.file.path);
    var smapsStream = smaps.SmapsTransformStream();

    rawStream.on('error',function(err){
      fs.unlinkSync(req.file.path);
      res.status(400).send('Invalid Smaps Type.');
      console.log(err);  
    });

    rawStream.pipe(smapsStream);

    smapsStream.on('error',function(err) {
      fs.unlinkSync(req.file.path);
      res.status(400).send('Invalid Smaps Type');
      console.log(err);  
    });
    smapsStream.on('finish',function(e) {
      fs.unlinkSync(req.file.path);
      res.send(smapsStream.read());
    })      
  });

  return router;
};