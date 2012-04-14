var Ant = require('../lib/ant');


var server = new Ant({
  name: 'server',
  port: 5001,
  debug: true
})

server.start();

function sayHello() {
  server.emit('hello');
  setTimeout(sayHello, 1000);
}

sayHello();

//server.spawn('./examples/client.js')