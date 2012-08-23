var Anthill = module.exports = function(options) {
}

Anthill.prototype.spawn = function(path) {
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