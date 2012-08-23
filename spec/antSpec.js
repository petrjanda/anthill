var dnode = require('dnode'),
    Ant = require('../lib/ant'),
    portfinder = require('portfinder'),
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

    it('should use autodiscovery of no port was given', function() {
      spyOn(portfinder, 'getPort');

      new Ant();

      expect(portfinder.getPort).toHaveBeenCalledWith(jasmine.any(Function));
    })  
  })
  
  describe( '', function() {
    var ant = null;
  
    beforeEach(function() {
      ant = new Ant({port: 99999});
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
        spyOn(EventEmitter.prototype, 'emit')
        
        ant.emit('foo', {bar: 'baz'});
      
        expect(EventEmitter.prototype.emit).toHaveBeenCalledWith('foo', { 
          name : 'foo', 
          data : { bar : 'baz' } 
        });
      })
    })
    
    describe('.connect', function() {
      it('should connect to dnode server', function() {
        spyOn( dnode, 'connect' )

        ant.connect( 1000, function() {} )
        
        expect(dnode.connect).toHaveBeenCalled();
      })
      
      it('should connect to dnode server with given port', function() {
        spyOn( dnode, 'connect' )

        ant.connect( '4000', function() {} )

        expect(dnode.connect).toHaveBeenCalledWith('4000', jasmine.any(Function));
      })
      
      it('should connect to dnode server with given host and port', function() {
        var params = { host: '192.168.0.1', port: 3000 };
        spyOn(dnode, 'connect');
            
        ant.connect( params, function() {} )

        expect(dnode.connect).toHaveBeenCalledWith( params, jasmine.any(Function) );
      })
    })
  })
})