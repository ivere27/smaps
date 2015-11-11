var fs = require('fs');
var async = require('async');

function readProcCmdline(callback) {
  fs.readdir('/proc/', function(err, pids){
    if (err)
      return callback(err)

    var cmdline = [];

    pids = pids.filter(function(e){ return e.match(/[0-9]/) });
    pids = pids.map(function(e){ return parseInt(e) });

    async.each(pids, function(pid, cb){
      fs.readFile('/proc/'+pid +'/cmdline', function (err, data) {
        //if (err) throw err; // FIXME : ignore?
        cmdline.push({pid: pid, cmdline: data.toString()});
        cb();
      });
    },
    function(err) {
      if (err)
        return callback(err);

      cmdline.sort(function(a, b){return a.pid - b.pid});
      callback(null, cmdline);
    });
  });
}

module.exports.readProcCmdline = readProcCmdline;