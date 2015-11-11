var stream = require("stream");
var smaps = require('../lib/smaps');

var text = 
"7f85af837000-7f85af838000 r--p 00009000 08:11 8652384                    /lib/x86_64-linux-gnu/libjson-c.so.2.0.0" + "\n" +
"Size:                  4 kB" + "\n" +
"Rss:                   4 kB" + "\n" +
"Pss:                   0 kB" + "\n" +
"Shared_Clean:          0 kB" + "\n" +
"Shared_Dirty:          4 kB" + "\n" +
"Private_Clean:         0 kB" + "\n" +
"Private_Dirty:         0 kB" + "\n" +
"Referenced:            0 kB" + "\n" +
"Anonymous:             4 kB" + "\n" +
"AnonHugePages:         0 kB" + "\n" +
"Swap:                  0 kB" + "\n" +
"KernelPageSize:        4 kB" + "\n" +
"MMUPageSize:           4 kB" + "\n" +
"Locked:                0 kB" + "\n" +
"VmFlags: rd mr mw me ac sd " + "\n" +
"7f85af838000-7f85af839000 rw-p 0000a000 08:11 8652384                    /lib/x86_64-linux-gnu/libjson-c.so.2.0.0" + "\n" +
"Size:                  4 kB" + "\n" +
"Rss:                   4 kB" + "\n" +
"Pss:                   0 kB" + "\n" +
"Shared_Clean:          0 kB" + "\n" +
"Shared_Dirty:          4 kB" + "\n" +
"Private_Clean:         0 kB" + "\n" +
"Private_Dirty:         0 kB" + "\n" +
"Referenced:            0 kB" + "\n" +
"Anonymous:             4 kB" + "\n" +
"AnonHugePages:         0 kB" + "\n" +
"Swap:                  0 kB" + "\n" +
"KernelPageSize:        4 kB" + "\n" +
"MMUPageSize:           4 kB" + "\n" +
"Locked:                0 kB" + "\n" +
"VmFlags: rd wr mr mw me ac sd " + "\n" +
"7f85b94d4000-7f85b9516000 rw-p 00000000 00:00 0                          [heap]" + "\n" +
"Size:                264 kB" + "\n" +
"Rss:                 100 kB" + "\n" +
"Pss:                  19 kB" + "\n" +
"Shared_Clean:          0 kB" + "\n" +
"Shared_Dirty:         96 kB" + "\n" +
"Private_Clean:         0 kB" + "\n" +
"Private_Dirty:         4 kB" + "\n" +
"Referenced:            0 kB" + "\n" +
"Anonymous:           100 kB" + "\n" +
"AnonHugePages:         0 kB" + "\n" +
"Swap:                 96 kB" + "\n" +
"KernelPageSize:        4 kB" + "\n" +
"MMUPageSize:           4 kB" + "\n" +
"Locked:                0 kB" + "\n" +
"VmFlags: rd wr mr mw me ac sd" + "\n";


var rawStream = new stream.Readable();
rawStream._read = function noop() {};
rawStream.push(text);
rawStream.push(null);
 
var smapsStream = smaps.SmapsTransformStream();
rawStream.pipe(smapsStream);

smapsStream.on('error',function(err){
  console.log(err);  
});
smapsStream.on('finish',function(e){
  console.log(smapsStream.read());  
  //console.log(process.memoryUsage())
})
