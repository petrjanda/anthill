var Ant = require('../lib/ant');


var server = new Ant({
  port: 5001
})

server.start();

function sayHello() {
  server.emit('hello');
  setTimeout(sayHello, 1000);
}

sayHello();