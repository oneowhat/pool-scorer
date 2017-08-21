'use strict'

var expect = require('chai').expect
var Player = require('../player')

describe('Player', function() {
  it('should exist', function() {
    var p = new Player()
    expect(p).to.not.be.undefined 
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

  describe('#hasWon', function() {
    it('should return true score is equal to or greater than points required to win', function() { 
      var p = new Player("Tester", 3)
      p.addPoint()
      p.addPoint()
      p.addPoint()
      expect(p.hasWon()).to.be.true
    })
    it('should return false score is less than points required to win', function() { 
      var p = new Player("Tester", 3)
      p.addPoint()
      p.addPoint()
      expect(p.hasWon()).to.be.false
    })
  })
})