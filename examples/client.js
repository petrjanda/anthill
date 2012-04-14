var Ant = require('../lib/ant');

var client = new Ant({
  name: 'client',
  port: 5000
})

client.connect(5001, function(remote) {
  remote.on('hello', function() {
    console.log('Hello world!');
  });
})

client.start();