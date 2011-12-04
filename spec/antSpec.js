var Ant = require('../lib/ant'),
    EventEmitter = require('eventemitter2').EventEmitter2;

describe('Ant', function() {
  
  describe('constructor', function() {
    it( 'should be instance of EventEmitter', function() {
      expect( new Ant() instanceof EventEmitter ).toBeTruthy();
    })
    
    it( 'should pass name', function() {
      expect( new Ant({name: 'foo'}).name ).toEqual('foo');
    })
    
    it( 'should pass port', function() {
      expect( new Ant({port: 9000}).port ).toEqual(9000);
    })
    
    it( 'should pass debug', function() {
      expect( new Ant({debug: true}).debug ).toEqual(true);
    })
    
    it( 'should have debug disabled by default', function() {
      expect( new Ant().debug ).toEqual(false);
    })    
  })
  
  describe( '', function() {
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
})