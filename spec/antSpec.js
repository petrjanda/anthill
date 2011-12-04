var Ant = require('../lib/ant'),
    EventEmitter = require('eventemitter2').EventEmitter2;

describe('Ant', function() {
  
  var ant = null;
  
  beforeEach(function() {
    ant = new Ant();
    ant.start();
  })
  
  afterEach(function() {
    try {
      ant.stop();
    } catch(err) {}
  })
  
  it('server should be defined', function() {
    expect(ant.server.server).toBeDefined();
  })
  
  describe('.emit', function() {
    it('server emit an event', function() {
      var s = spyOn(EventEmitter.prototype, 'emit')
      ant.emit('foo', {bar: 'baz'});
      
      expect(s).toHaveBeenCalledWith('foo', { 
        name : 'foo', 
        data : { bar : 'baz' } 
      });
    })
  })
})