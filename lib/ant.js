/*
 * ANTHILL.JS - distributed asynchronous library with publich / subscribe support
 */

/*
 * Package dependencies.
 */
var dnode = require('dnode'),
    forever = require('forever'),
    util = require('util'),
    portfinder = require('portfinder'),
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
  self.port = options['port'];

  if(self.port) {
    self._init();
  } else {
    portfinder.getPort(function (err, port) {
      self.port = port;
      self._init();
    });
  }
};

util.inherits( Ant, EventEmitter );

/*
 * Initialize dnode server in order to communicate with other ants 
 * in the cloud.
 *
 * @private
 */
Ant.prototype._init = function() {
  var self = this;
  
  self.server = dnode(function (client, conn) {    
    conn.on('ready', function () {
      self.emit("client.ready", client.id);
    });
    /*
     * Connection end handler. Triggered when client connection is lost.
     */
    conn.on('end', function () {
      self.emit("client.end", client.id);
    });
    
    // Remote API - list of the functions, which are available to be called
    // with RPC.

    /*
     * Register event listening callback.
     *
     * @param {String} Event name.
     * @param {String} Callback function.
     */
    this.on = function(name, cb) {
      self.on(name, cb);
    }

    /*
     * Remove previously registered event listener callback.
     *
     * @param {String} Event name.
     * @param {String} Callback function.
     */
    this.off = function(name, cb) {
      self.off(name, cb);
    }
  });
  
  self.server.on('connection', function (connection) {
    self.emit('connection.open', connection);
  });

  self.server.on('ready', function () {
    self.emit('ant.listening', self.post);
    self.emit('ant.started', self);
  });
  
  // Simple debugging.
  if(self.debug) {
    self.onAny(function (event) {
      console.log( Date() + ' ' + self.name + ' -> ' + event.name );
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
 * @param {Object} Connection params.
 * @param {Function} Callback to be called after successful connect.
 */
Ant.prototype.connect = function(params, cb) {
  var self = this;
  
  dnode.connect(params, function (remote, connection) {
    connection.on('end', function () {
      self.emit('end', params);
    });
    
    self.emit('connect', params);
        
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

/*
 * Stop the ant.
 */
Ant.prototype.stop = function() {
  var self = this;
  self.server.server.close();
}

Ant.prototype.spawn = function(path) {
  var self = this;
  
  var child = new (forever.Monitor)(path, {
    max: 10,
    silent: true,
    //forever: true,
    options: []
  });

  child.on('exit', function(code) {
    self.emit('child.exit')
  });
  
  child.on('start', function(process, data) {
    self.emit('child.started', data)
  })
   
  child.start();
}