var async = require('async');
var fs = require('fs');
var util = require("util");
var stream = require("stream");

var settings = require('../settings.json');
var BRIDGE_PATH = settings.ADB_PATH;

function callChildProcess(command, cb) {
  var exec = require('child_process').exec,
      child;

  child = exec(command, cb);
}

function readProcCmdline(callback) {
  callChildProcess(BRIDGE_PATH + ' root on 1>/dev/null && ' + BRIDGE_PATH + ' shell ls /proc/', function(err, stdout, stderr){
    if (err)
      return callback(err);

    var pids = [];
    stdout.split('\n').map(function(e){
      e.split(/\s+/).map(function(e){
        pids.push(e);
      })
    });

    pids = pids.filter(function(e){ return e.match(/[0-9]/) });
    pids = pids.map(function(e){ return parseInt(e) });

    var cmdline = [];
    async.each(pids, function(pid, cb){
      callChildProcess(BRIDGE_PATH + ' root on 1>/dev/null && ' + BRIDGE_PATH + ' shell cat /proc/'+pid+'/cmdline', function(err, stdout, stderr){
        if (stdout.indexOf('No such file or directory') !== -1)
          return cb();

        cmdline.push({pid: pid, cmdline: stdout.toString()});
        cb();
      })
    },
    function(err) {
      if (err)
        return callback(err);

      cmdline.sort(function(a, b){return a.pid - b.pid});
      callback(null, cmdline);
    });

    //console.log(pids);
  })
}

function SmapsStream(pid, options) {
  var self = this;
  if (!(this instanceof SmapsStream)) {
    return new SmapsStream(pid, options);
  }

  callChildProcess(BRIDGE_PATH + ' root on 1>/dev/null && ' + BRIDGE_PATH + ' shell cat /proc/'+pid+'/smaps', function(err, stdout, stderr){
    if (stdout.indexOf('No such file or directory') !== -1)
      return self.push(null);

    self.push(stdout.toString());
    self.push(null);
  })
  stream.Readable.call(this, options);
};
util.inherits(SmapsStream, stream.Readable);
SmapsStream.prototype._read = function(n) {};


module.exports.readProcCmdline = readProcCmdline;
module.exports.SmapsStream = SmapsStream;
