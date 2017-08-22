'use strict'

var expect = chai.expect

describe('StraightPool', function() {
  
  var sandbox;
  
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(window.console, "error");
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    var g = new StraightPool()
    expect(g).to.not.be.undefined 
  })

  describe('constructor', function() {
    it('should log error if player 1 name not passed', function() {
      var g = new StraightPool("", "Test 2", 125, 125)
      sinon.assert.calledTwice(console.error)
      sinon.assert.calledWithExactly(console.error, "Missing player 1 name")
    })
    it('should log error if player 2 name not passed', function() {
      var g = new StraightPool("Test 1", "", 125, 125)
      sinon.assert.calledTwice(console.error)
      sinon.assert.calledWithExactly(console.error, "Missing player 2 name")
    })
    it('should log error if player 1 points not passed', function() {
      var g = new StraightPool("Test 1", "Test 2", null, 125)
      sinon.assert.calledTwice(console.error)
      sinon.assert.calledWithExactly(console.error, "Missing player 1 points")
    })
    it('should log error if player 2 points not passed', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, null)
      sinon.assert.calledTwice(console.error)
      sinon.assert.calledWithExactly(console.error, "Missing player 2 points")
    })
  })

})