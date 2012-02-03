var shell = require("ringo/shell");
var {Worker} = require("ringo/worker");

var repl = {
  running:false,
  cb: function(cmd) {
    console.log(JSON.stringify(eval(cmd)));
  },
  start:function(module, cb) {
    this.running = true;
    this.w.postMessage("repl");

    if(typeof cb != "undefined" && typeof cb == "function") {
      this.cb = cb;
    }
  },
  run:function() {
    var cmd;

    if((cmd = shell.readln("RINGO> ", ""))) {
      try{
        this.cb(cmd);
      } catch (x) {
        console.error(x);
      }
    }
    if(this.running)
      this.w.postMessage("repl");
  },
  w:new Worker({onmessage:function(e) {
                      if(e.data == "repl")
                        repl.run();
                    }            
               })
};

exports.repl = repl;