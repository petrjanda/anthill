/*
 * Package dependencies.
 */
var dnode = require('dnode'),
    EventEmitter = require('eventemitter2').EventEmitter2;
    
/*
 *  Ant is the building unit of the architecture. Its the separate process
 *  which is supposed to take care about some I/0 task and can talk to
 *  other processes.
 *
 *  @param {Object} Additional configuration options for an ant.
 *    - use-wildcard {Boolean} Control the usage of wildcards.
 *    - delimiter {String} Delimiter of the segments in event names.
 *    - max-listeners {Number} Max. count of listeners for an event.
 *    - port {Number} Port to start ant on.
 */
var Ant = module.exports = function(options) {
  var self = this;
  
  self._connections = {};
  self.options = options || {};
  
  self.emitter = new EventEmitter({
    wildcard:     self.options['use-wildcard'] || true,
    delimiter:    self.options['delimiter'] || '.',
    maxListeners: self.options['max-listeners'] || 100,
  });
  
  self.server = dnode(function (client, conn) {    
    conn.on('end', function () {
      self.emit("client.end", client.id);
    });
    
    this.on = function(name, cb) {
      self.emitter.on(name, cb);
    }
  });
};

/*
 *  Emit an event with specified attributes for all subscribed listeners.
 *
 *  @param {String} Event name.
 *  @param {Object} Event content data.
 */
Ant.prototype.emit = function(name, data) {
  var self = this;  
  self.emitter.emit(name, data);
};

/*
 *  Subscribe to the given ant for a given event. Other events emited by
 *  ant will not be delivered.
 *
 *  @param {String} Ant name.
 *  @param {String} Event name. 
 */
Ant.prototype.on = function(antPort, name, cb) {
  var self = this;
  
  self._connections[antPort].client.on(name, cb);
};

/*
 * Connect to another ant.
 *
 * @param {String} Port, where the ant is running.
 * @param {Function} Callback to be called after successful connect.
 */
Ant.prototype.connect = function(antPort, cb) {
  var self = this;
  
  dnode.connect(antPort, function (client, connection) {
    connection.on('end', function () {
      self.emit('end', antPort);
    });
    
    self.emit('connect', antPort);
    
    self._connections[antPort] = {
      client: client, 
      connection: connection
    };
    
    cb(client);
  });
}

Ant.prototype.start = function() {
  var self = this;
  self.server.listen(self.options['port'] || 5000);
}

Ant.prototype.stop = function() {
  var self = this;
  self.server.server.close();
}