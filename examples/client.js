var Ant = require('../lib/ant');

var client = new Ant({
  name: 'client',
  port: 4000
})

client.connect(4001, function(remote) {
  remote.on('hello', function() {
    console.log('Hello world!');
  });
})

client.start();