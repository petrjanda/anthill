var Ant = require('../lib/ant');

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
      var s = spyOn(ant.emitter, 'emit')
      ant.emit('foo', {bar: 'baz'});
      expect(s).toHaveBeenCalledWith('foo', {bar: 'baz'})
    })
  })
  
  describe('.on', function() {
    it('should call proper client on method', function() {
      client = {
        on: function() {}
      }
      
      ant._connections['ant-name'] = {
        client: client
      }
      
      var s = spyOn(client, 'on')
      
      var f = function() {}
      ant.on('ant-name', 'foo', f);
      expect(s).toHaveBeenCalledWith('foo', f)
    })
  })
})