'use strict'

var expect = chai.expect

describe('StraightPool', function() {
  
  var sandbox
  
  beforeEach(function() {
    sandbox = sinon.sandbox.create()
    sandbox.stub(window.console, "error")
  })

  afterEach(function() {
    sandbox.restore()
  })

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
    it('should create two players', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      expect(g.playerOne instanceof Player).to.be.true
      expect(g.playerTwo instanceof Player).to.be.true
    })
    it('should set activePlayer to playerOne', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      expect(g.playerOne).equal(g.activePlayer)
    })
    it('should initialize the rack at 15 balls', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      expect(g.rack).equal(15)
    })
    it('should initialize gameState to "PLAYING"', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      expect(g.gameState).equal(gameStates.PLAYING)
    })
  })

  describe("#switch", function () {
    it('should switch the activePlayer', function () {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      g.switch()
      expect(g.playerTwo).equal(g.activePlayer)
    })
  })

  describe("#addPoint", function() {
    it('should add a point to the score of the active player', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      var originalScore = g.activePlayer.score
      g.addPoint()
      expect(g.activePlayer.score).equal(originalScore + 1)
    })
    it('should set winner if player wins', function() {
      var bus = new EventBus()
      var g = new StraightPool("Test 1", "Test 2", 1, 1, bus)
      g.addPoint()
      expect(g.winner).equal(g.playerOne)
      expect(g.gameState).equal(gameStates.DONE)
    })
  })
  
  describe("#losePoint", function() {
    it('should remove a point from the score of the active player', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      g.activePlayer.score = 12
      var originalScore = g.activePlayer.score
      g.losePoint()
      expect(g.activePlayer.score).equal(originalScore - 1)
    })
  })
  
  describe("#foul", function() {
    it('should cause the active player to lose a point', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      g.playerOne.score = 12
      g.foul()
      expect(g.playerOne.score).equal(11)
    })
    it('should switch the active player', shouldSwitchActivePlayer)
  })

  describe("#miss", function() {
    it('should switch the active player', shouldSwitchActivePlayer)
  })
  
  describe("#safe", function() {
    it('should switch the active player', shouldSwitchActivePlayer)
  })

  describe('#incrementRack', function() {
    it('should increase the rack by one', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      g.rack = 10
      var rack = g.rack
      g.incrementRack()
      expect(g.rack).to.equal(rack + 1)
    })
    it('should not increase the rack past 15', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      var rack = g.rack
      g.incrementRack()
      expect(g.rack).to.equal(15)
    })
  })
  
  describe('#decrementRack', function() {
    it('should decrease the rack by one', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      var rack = g.rack
      g.decrementRack()
      expect(g.rack).to.equal(rack - 1)
    })
    it('should pause the game when rack reaches 0', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      g.rack = 2
      g.decrementRack()
      expect(g.gameState).to.equal(gameStates.PAUSED)
    })
  })

  describe('#newRack', function() {
    it('should set the rack to 15', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      g.rack = 9
      g.newRack()
      expect(g.rack).to.equal(15)
    })
    it('should set the game state to "PLAYING"', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      g.rack = 2
      g.decrementRack()
      g.newRack()
      expect(g.gameState).to.equal(gameStates.PLAYING)
    })
  })

  describe('#isPaused', function() {
    it('should return true if the gameState is "PAUSED"', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      g.gameState = gameStates.PAUSED
      var actual = g.isPaused()
      expect(actual).to.be.true
    })
    it('should return true if the gameState is not "PAUSED"', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, 125)
      g.gameState = gameStates.PLAYING
      var actual = g.isPaused()
      expect(actual).to.be.false
    })
  })

})

function shouldSwitchActivePlayer() {
  var g = new StraightPool("Test 1", "Test 2", 125, 125)
  var name = g.activePlayer.name
  g.foul()
  expect(g.activePlayer.name).to.not.equal(name)
}