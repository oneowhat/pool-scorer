'use strict';

var expect = chai.expect;

describe('StraightPool', function() {
  
  var sandbox;
  var game;
  var bus;
  
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(window.console, "error");
    bus = new EventBus();
    game = new StraightPool("Test 1", "Test 2", 125, 125, bus);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    var g = new StraightPool();
    expect(g).to.not.be.undefined; 
  });

  describe('constructor', function() {
    it('should log error if player 1 name not passed', function() {
      var g = new StraightPool("", "Test 2", 125, 125);
      sinon.assert.calledTwice(console.error);
      sinon.assert.calledWithExactly(console.error, "Missing player 1 name");
    });
    it('should log error if player 2 name not passed', function() {
      var g = new StraightPool("Test 1", "", 125, 125);
      sinon.assert.calledTwice(console.error);
      sinon.assert.calledWithExactly(console.error, "Missing player 2 name");
    });
    it('should log error if player 1 points not passed', function() {
      var g = new StraightPool("Test 1", "Test 2", null, 125);
      sinon.assert.calledTwice(console.error);
      sinon.assert.calledWithExactly(console.error, "Missing player 1 points");
    });
    it('should log error if player 2 points not passed', function() {
      var g = new StraightPool("Test 1", "Test 2", 125, null);
      sinon.assert.calledTwice(console.error);
      sinon.assert.calledWithExactly(console.error, "Missing player 2 points");
    });
    it('should create two players', function() {
      expect(game.playerOne instanceof Player).to.be.true;
      expect(game.playerTwo instanceof Player).to.be.true;
    });
    it('should set activePlayer to playerOne', function() {
      expect(game.playerOne).equal(game.activePlayer);
    });
    it('should initialize the rack at 15 balls', function() {
      expect(game.rack).equal(15);
    });
    it('should initialize gameState to "PLAYING"', function() {
      expect(game.gameState).equal(gameStates.PLAYING);
    });
  });

  describe("#switch", function () {
    it('should switch the activePlayer', function () {
      game.switch();
      expect(game.playerTwo).equal(game.activePlayer);
    });
  });

  describe("#addPoint", function() {
    it('should add a point to the score of the active player', function() {
      var originalScore = game.activePlayer.score;
      game.addPoint();
      expect(game.activePlayer.score).equal(originalScore + 1);
    });
    it('should set winner if player wins', function() {
      var i = 0;
      while (i < 125) {
        game.addPoint();
        i++;
      }
      expect(game.winner).equal(game.playerOne);
      expect(game.gameState).equal(gameStates.DONE);
    });
  });
  
  describe("#losePoint", function() {
    it('should remove a point from the score of the active player', function() {
      game.activePlayer.score = 12;
      var originalScore = game.activePlayer.score;
      game.losePoint();
      expect(game.activePlayer.score).equal(originalScore - 1);
    });
  });
  
  describe("#foul", function() {
    it('should cause the active player to lose a point', function() {
      game.playerOne.score = 12;
      game.foul();
      expect(game.playerOne.score).equal(11);
    });
    it('should switch the active player', function() {
      shouldSwitchActivePlayer(game);
    });
  });

  describe("#miss", function() {
    it('should switch the active player', function() {
      shouldSwitchActivePlayer(game);
    });
  });
  
  describe("#safe", function() {
    it('should switch the active player', function() {
      shouldSwitchActivePlayer(game);
    });
  });

  describe('#incrementRack', function() {
    it('should increase the rack by one', function() {
      game.rack = 10;
      var rack = game.rack;
      game.incrementRack();
      expect(game.rack).to.equal(rack + 1);
    });
    it('should not increase the rack past 15', function() {
      game.incrementRack();
      expect(game.rack).to.equal(15);
    });
  });
  
  describe('#decrementRack', function() {
    it('should decrease the rack by one', function() {
      var expected = game.rack - 1;
      game.decrementRack();
      expect(game.rack).to.equal(expected);
    });
    it('should pause the game when rack reaches 0', function() {
      game.rack = 2;
      game.decrementRack();
      expect(game.gameState).to.equal(gameStates.PAUSED);
    });
  });

  describe('#newRack', function() {
    it('should set the rack to 15', function() {
      game.rack = 9;
      game.newRack();
      expect(game.rack).to.equal(15);
    });
    it('should set the game state to "PLAYING"', function() {
      game.rack = 2;
      game.decrementRack();
      game.newRack();
      expect(game.gameState).to.equal(gameStates.PLAYING);
    });
  });

  describe('#isPaused', function() {
    it('should return true if the gameState is "PAUSED"', function() {
      game.gameState = gameStates.PAUSED;
      var actual = game.isPaused();
      expect(actual).to.be.true;
    });
    it('should return true if the gameState is not "PAUSED"', function() {
      game.gameState = gameStates.PLAYING;
      var actual = game.isPaused();
      expect(actual).to.be.false;
    });
  });

});

function shouldSwitchActivePlayer(game) {
  var name = game.activePlayer.name;
  game.foul();
  expect(game.activePlayer.name).to.not.equal(name);
}