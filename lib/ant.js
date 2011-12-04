/*
 * ANTHILL.JS - distributed asynchronous library with publich / subscribe support
 */

/*
 * Package dependencies.
 */
var dnode = require('dnode'),
    util = require('util'),
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
  
  options = options || {};
    
  EventEmitter.call(this, {
    wildcard:     options['use-wildcard'] || true,
    delimiter:    options['delimiter'] || '.',
    maxListeners: options['max-listeners'] || 100,
  });
  
  self.debug = options['debug'] || false;
  self.name = options['name'] || 'ant-' + Math.round(Math.random() * 10000);
  self.port = options['port'] || 4000;
  
  self.server = dnode(function (client, conn) {    
    conn.on('end', function () {
      self.emit("client.end", client.id);
    });
    
    this.on = function(name, cb) {
      self.on(name, cb);
    }
    
    this.off = function(name, cb) {
      self.off(name, cb);
    }
  });
  
  self.server.on('connection', function (connection) {
    self.emit('connection.open', connection);
  });

  self.server.on( 'ready', function () {
    self.emit( 'ant.listening', self.post );
    self.emit( 'ant.started', self );
  });

  self.init();
};

util.inherits( Ant, EventEmitter );

Ant.prototype.init = function() {
  var self = this;
  
  // Simple debugging.
  if( self.debug ) {
    self.onAny( function(event) {
      console.log( self.name + ' -> ' + event.name );
    })
  }
}

/*
 *  Emit an event with specified attributes for all subscribed listeners.
 *
 *  @param {String} Event name.
 *  @param {Object} Event content data.
 */
Ant.prototype.emit = function(name, data) {
  EventEmitter.prototype.emit.call(this, name, {
    name: name,
    data: data
  });
};

/*
 * Connect to another ant.
 *
 * @param {String} Port, where the ant is running.
 * @param {Function} Callback to be called after successful connect.
 */
Ant.prototype.connect = function(antPort, cb) {
  var self = this;
  
  dnode.connect(antPort, function (remote, connection) {
    connection.on('end', function () {
      self.emit('end', antPort);
    });
    
    self.emit('connect', antPort);
        
    cb(remote);
  });
}

/*
 * Start ant on a given port and make it available for connection from
 * other running ants.
 */
Ant.prototype.start = function() {
  var self = this;
  self.server.listen(self.port);
}

Ant.prototype.stop = function() {
  var self = this;
  self.server.server.close();
}