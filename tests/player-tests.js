'use strict'

var expect = chai.expect

describe('Player', function() {

  var sandbox
  
  beforeEach(function() {
    sandbox = sinon.sandbox.create()
    sandbox.stub(window.console, "error")
  })

  afterEach(function() {
    sandbox.restore()
  })

  it('should exist', function() {
    var p = new Player()
    expect(p).to.not.be.undefined 
  })

  describe('constructor', function() {
    it('should have a default name', function() {
      var p = new Player()
      expect(p.name).to.equal("Anon")
    })
    it('should use a name if provided', function() {
      var p = new Player("Tester")
      expect(p.name).to.equal("Tester")
    })
    it('should use winAt score if provided', function() {
      var p = new Player("Tester", 125)
      expect(p.winAt).to.equal(125)
    })
    it('should log error if no name is passed', function() {
      var p = new Player(undefined, 1)
      sinon.assert.calledOnce(console.error)
      sinon.assert.calledWithExactly(console.error, "Player missing name")
    })
    it('should log error if no points value is passed', function() {
      var p = new Player("Tester")
      sinon.assert.calledOnce(console.error)
      sinon.assert.calledWithExactly(console.error, "Player missing points, winAt will default to 0")
    })
  })

  describe('#addPoint', function() {
    it('increases the score by one', function() {
      var p = new Player()
      var originalScore = p.score
      p.addPoint()
      expect(p.score).to.equal(originalScore + 1)
    })
    it('increases the current run by one', function() {
      var p = new Player()
      var originalRun = p.run
      p.addPoint()
      expect(p.run).to.equal(originalRun + 1)
    })
    it('should set high run if greater than current high', function() {
      var p = new Player()
      var originalRun = p.run
      p.addPoint()
      expect(p.run).to.equal(p.highRun)
    })
    it('set hasWon to true if points >= winAt', function() {
      var p = new Player("Test", 1)
      p.addPoint()
      expect(p.hasWon).to.equal(true)
    })
  })
  
  describe('#losePoint', function() {
    it('decreases the score by one', function() {
      var p = new Player()
      p.score = 12
      p.losePoint()
      expect(p.score).to.equal(11)
    })
    it('decreases the current run by one', function() {
      var p = new Player()
      p.run = 12
      p.losePoint()
      expect(p.run).to.equal(11)
    })
    it('should never be negative', function() {
      var p = new Player()
      p.losePoint()
      expect(p.score).to.equal(0)
    })
  })

  describe('#miss', function() {
    it('should set the current run to 0', function() {
      var p = new Player()
      p.addPoint()
      p.miss()
      expect(p.run).to.equal(0)
    })
    it('should increase the miss count by 1', function() {
      var p = new Player()
      p.addPoint()
      p.miss()
      expect(p.misses).to.equal(1)
    })
  })
  
  describe('#safe', function() {
    it('should set the current run to 0', function() {
      var p = new Player()
      p.addPoint()
      p.safe()
      expect(p.run).to.equal(0)
    })
    it('should increase the safety count by 1', function() {
      var p = new Player()
      p.addPoint()
      p.safe()
      expect(p.safeties).to.equal(1)
    })
  })
})