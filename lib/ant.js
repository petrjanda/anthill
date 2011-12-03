var dnode = require('dnode'),
    EventEmitter = require('eventemitter2').EventEmitter2;
    
//
// Ant is the building unit of the architecture. Its the separate process
// which is supposed to take care about some I/0 task and can talk to
// other processes.
//

var Ant = module.exports = function(options) {
  var self = this;
  
  self.options = options || {};
  
  self.emitter = new EventEmitter({
    wildcard:     options['use-wildcard'] || true,
    delimiter:    options['delimiter'] || '.',
    maxListeners: options['max-listeners'] || 100,
  });
  
  self.emitter.on('hello', function() {
    console.log("I am here!");
  })
  
  self.emitter.emit('hello');
  
  self.server = dnode({
    on: function(name, cb) {
      console.log("Subscribed");
      console.log(name);
      console.log(cb);
      self.emitter.on(name, cb);
    }
  });
};

//
// Emit an event with specified attributes for all subscribed listeners.
//
// @param {String} Event name.
// @param {Object} Event content data.
//
Ant.prototype.emit = function(name, data) {
  var self = this;  
  self.emitter.emit(name, data);
};

//
// Subscribe to the given ant for a given event. Other events emited by
// ant will not be delivered.
//
// @param {String} Ant name.
// @param {String} Event name. 
//
Ant.prototype.on = function(ant, name, cb) {
  var self = this;
  
  dnode.connect(ant, function(remote) {
    remote.on(name, cb);
  })
};

Ant.prototype.start = function() {
  var self = this;
  
  self.server.listen(self.options['port'] || 5000);
}