'use strict';

var expect = chai.expect;

describe('OnePocket', function() {
  
  var sandbox;
  var game;
  var bus;
  
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(window.console, "error");
    bus = new EventBus();
    game = new OnePocket("Test 1", "Test 2", 125, 125, bus);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    var g = new OnePocket();
    expect(g).to.not.be.undefined; 
  });

  describe('constructor', function() {
    it('should log error if player 1 name not passed', function() {
      var g = new OnePocket("", "Test 2", 125, 125);
      sinon.assert.calledTwice(console.error);
      sinon.assert.calledWithExactly(console.error, "Missing player 1 name");
    });
    it('should log error if player 2 name not passed', function() {
      var g = new OnePocket("Test 1", "", 125, 125);
      sinon.assert.calledTwice(console.error);
      sinon.assert.calledWithExactly(console.error, "Missing player 2 name");
    });
    it('should log error if player 1 points not passed', function() {
      var g = new OnePocket("Test 1", "Test 2", null, 125);
      sinon.assert.calledTwice(console.error);
      sinon.assert.calledWithExactly(console.error, "Missing player 1 points");
    });
    it('should log error if player 2 points not passed', function() {
      var g = new OnePocket("Test 1", "Test 2", 125, null);
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
  
  describe("#foul", function() {
    it('should cause the active player to lose a point', function() {
      game.playerOne.points = 12;
      game.foul();
      expect(game.playerOne.points).equal(11);
    });
    it('should increment the rack if player has any points', function() {
      game.playerOne.points = 1;
      game.rack = 13;
      game.foul();
      expect(game.rack).equal(14);
    });
    it('should switch the active player', function() {
      shouldSwitchActivePlayer(game);
    });
  });

});