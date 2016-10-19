var util = require("util");
var stream = require("stream");

//http://lxr.free-electrons.com/source/fs/proc/task_mmu.c#L266
/*
       /proc/[pid]/smaps (since Linux 2.6.14)
              This file shows memory consumption for each of the process's
              mappings.  (The pmap(1) command displays similar information,
              in a form that may be easier for parsing.)  For each mapping
              there is a series of lines such as the following:

                  00400000-0048a000 r-xp 00000000 fd:03 960637       /bin/bash
                  Size:                552 kB
                  Rss:                 460 kB
                  Pss:                 100 kB
                  Shared_Clean:        452 kB
                  Shared_Dirty:          0 kB
                  Private_Clean:         8 kB
                  Private_Dirty:         0 kB
                  Referenced:          460 kB
                  Anonymous:             0 kB
                  AnonHugePages:         0 kB
                  Swap:                  0 kB
                  KernelPageSize:        4 kB
                  MMUPageSize:           4 kB
                  Locked:                0 kB

              The first of these lines shows the same information as is
              displayed for the mapping in /proc/[pid]/maps.  The remaining
              lines show the size of the mapping, the amount of the mapping
              that is currently resident in RAM ("Rss"), the process'
              proportional share of this mapping ("Pss"), the number of
              clean and dirty shared pages in the mapping, and the number of
              clean and dirty private pages in the mapping.  "Referenced"
              indicates the amount of memory currently marked as referenced
              or accessed.  "Anonymous" shows the amount of memory that does
              not belong to any file.  "Swap" shows how much would-be-
              anonymous memory is also used, but out on swap.

              The "KernelPageSize" entry is the page size used by the kernel
              to back a VMA.  This matches the size used by the MMU in the
              majority of cases.  However, one counter-example occurs on
              PPC64 kernels whereby a kernel using 64K as a base page size
              may still use 4K pages for the MMU on older processors.  To
              distinguish, this patch reports "MMUPageSize" as the page size
              used by the MMU.

              The "Locked" indicates whether the mapping is locked in memory
              or not.

              "VmFlags" field represents the kernel flags associated with
              the particular virtual memory area in two letter encoded
              manner.  The codes are the following:

                  rd  - readable
                  wr  - writable
                  ex  - executable
                  sh  - shared
                  mr  - may read
                  mw  - may write
                  me  - may execute
                  ms  - may share
                  gd  - stack segment grows down
                  pf  - pure PFN range
                  dw  - disabled write to the mapped file
                  lo  - pages are locked in memory
                  io  - memory mapped I/O area
                  sr  - sequential read advise provided
                  rr  - random read advise provided
                  dc  - do not copy area on fork
                  de  - do not expand area on remapping
                  ac  - area is accountable
                  nr  - swap space is not reserved for the area
                  ht  - area uses huge tlb pages
                  nl  - non-linear mapping
                  ar  - architecture specific flag
                  dd  - do not include area into core dump
                  sd  - soft-dirty flag
                  mm  - mixed map area
                  hg  - huge page advise flag
                  nh  - no-huge page advise flag
                  mg  - mergeable advise flag

              The /proc/[pid]/smaps file is present only if the
              CONFIG_PROC_PAGE_MONITOR kernel configuration option is
              enabled.
*/

function parseSmapsChunkLine(lines) {
  var o = {};

  if (!Array.isArray(lines))
    return null;

  try {
    var firstLine = lines.shift();
    var lastLine = ( lines[lines.length - 1].indexOf('VmFlags') !== -1 )
                   ? lines.pop()
                   : null;

    var a = firstLine.split(/\s+/);
    o['start']        = a[0].split('-')[0];
    o['end']          = a[0].split('-')[1];
    o['flags']        = a[1];
    o['pgoff']        = a[2];
    o['dev']          = a[3];
    o['ino']          = a[4];
    o['name']         = a[5];

    if (lastLine) {
      var a = lastLine.split(':');
      o[a[0]] = a[1]; //.trim().split(/\s+/);
    } else {
      o['VmFlags'] = null;
    }

    lines.map(function(e){
      var a = e.replace(':','').replace('kB','').split(/\s+/);
      o[a[0]] = parseInt(a[1]);
    })
  } catch(e) {
    console.error(e);
    return null;
  }
  return o;
}

function parseSmapsChunkText(raw) {
  if (typeof raw !== 'string')
    return null;

  return parseSmapsChunkLine(raw.trim().split('\n'));
}



function SmapsTransformStream(options) {
  if (!(this instanceof SmapsTransformStream)) {
    return new SmapsTransformStream(options);
  }
  stream.Transform.call(this, options);
  this._writableState.objectMode = false;
  this._readableState.objectMode = true;

  this._text = '';
  this._chunks = [];

};
util.inherits(SmapsTransformStream, stream.Transform);

SmapsTransformStream.prototype._transform = function (chunk, encoding, cb) {
  this._text += chunk;
  cb();
};

SmapsTransformStream.prototype._flush = function(cb) {
  var offset = 0;
  var delimiter = (this._text.indexOf('VmFlags') !== -1) ? 'VmFlags' : 'Locked';

  while((offset = this._text.indexOf('\n', this._text.indexOf(delimiter))) !== -1 ) {
    var buffer = this._text.slice(0, offset);
    this._text = this._text.slice(offset);

    if (buffer.trim().length == 0)
      break;

    var chunk = parseSmapsChunkText(buffer);  

    if (!chunk) {
      this.emit('error', new Error('Invalid Smaps Type.'), buffer);
      break;
    }
    this._chunks.push(chunk);    
  }
  this.push(this._chunks);
  cb();
};


module.exports.parseSmapsChunkText = parseSmapsChunkText;
module.exports.parseSmapsChunkLine = parseSmapsChunkLine;
module.exports.SmapsTransformStream = SmapsTransformStream;