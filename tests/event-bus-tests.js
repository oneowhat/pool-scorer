'use strict'

var expect = chai.expect

describe('EventBus', function() {  
  
  var sandbox
  
  beforeEach(function() {
    sandbox = sinon.sandbox.create()
    sandbox.stub(window.console, "log")
  })

  afterEach(function() {
    sandbox.restore()
  })
  
  describe('#on', function() {
    it('adds an event handler', function() {
      var whatNow = new EventBus()
      whatNow.on('test', function() { })
      expect(whatNow.handlers['test'].length).to.equal(1)
    })
  })

  describe('#emit', function() {
    it('executes functions associated with the name passed', function() {
      var whatNow = new EventBus()
      whatNow.on('test', function() {
        console.log('executed')
      })
      whatNow.emit('test')
      sinon.assert.calledOnce(console.log)
    })
    it('executes functions with the args passed in', function() {
      var whatNow = new EventBus()
      var parm = "one"
      var parm2 = "two"
      var result = {}
      whatNow.on('test', function(p1, p2) {
        result.parm = p1
        result.parm2 = p2
      })
      whatNow.emit('test', parm, parm2)
      expect(result.parm).to.equal(parm)
      expect(result.parm2).to.equal(parm2)
    })
  })

});