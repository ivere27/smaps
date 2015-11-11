var fs = require('fs');
var smaps = require('../lib/smaps');

var pid = process.pid;
var rawStream = fs.createReadStream('/proc/' + pid + '/smaps');

var smapsStream = smaps.SmapsTransformStream();
rawStream.pipe(smapsStream);

smapsStream.on('error',function(err){
  console.log(err);  
});
smapsStream.on('finish',function(e){
  console.log(smapsStream.read());  
  //console.log(process.memoryUsage())
})