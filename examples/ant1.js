var Ant = require('./lib/ant');

var ant = new Ant({
  port: 5000
})

ant.connect(5001, function(client) {
  client.on('event', function() {
    console.log('Hello world!');
  });
})

ant.start();