(function(exports) {
  
  'use strict';

  var gameStates = {
    'PLAYING': 'PLAYING',
    'PAUSED': 'PAUSED',
    'DONE': 'DONE'
  };
  
  function switchPlayers() {
    this.activePlayer = this.activePlayer === this.playerOne
      ? this.playerTwo
      : this.playerOne;
  }

  function PoolGame() {
    this.rack = 15;
    this.gameState = gameStates.PLAYING;
    this.startedAt = new Date();
    this.endedAt = null;
    this.winner = null;
  }

  PoolGame.prototype.init = function(pOneName, pTwoName, pOnePoints, pTwoPoints, eventBus) {
    if (!pOneName) {
      console.error("Missing player 1 name");
    }
    if (!pTwoName) {
      console.error("Missing player 2 name");
    }
    if (!pOnePoints) {
      console.error("Missing player 1 points");
    }
    if (!pTwoPoints) {
      console.error("Missing player 2 points");
    }
    this.playerOne = new Player (pOneName, pOnePoints, eventBus);
    this.playerTwo = new Player (pTwoName, pTwoPoints, eventBus);
    this.eventBus = eventBus;
    this.activePlayer = this.playerOne;

    if (eventBus !== undefined) {
      var game = this;
      eventBus.on('playerWon', function (player) {
        game.winner = player;
        game.gameState = gameStates.DONE;
        game.endedAt = new Date();
      });
    }  
  };

  PoolGame.prototype.switch = switchPlayers;

  PoolGame.prototype.addPoint = function() {
    this.activePlayer.addPoint();
    this.decrementRack();
  };

  PoolGame.prototype.losePoint = function() {
    this.activePlayer.losePoint();
  };

  PoolGame.prototype.miss = function() {
    this.activePlayer.miss();
    this.switch();
  };

  PoolGame.prototype.safe = function() {
    this.activePlayer.safe();
    this.switch();
  };

  PoolGame.prototype.incrementRack = function() {
    this.rack = this.rack === 15 
      ? this.rack 
      : this.rack + 1;
  };

  PoolGame.prototype.decrementRack = function() {
    this.rack -= 1;
    if (this.rack === 1) {
      this.gameState = gameStates.PAUSED;
    }
  };

  PoolGame.prototype.newRack = function() {
    this.rack = 15;
    this.gameState = gameStates.PLAYING;
  };

  PoolGame.prototype.isPaused = function(){
    return this.gameState === gameStates.PAUSED;
  };

  function StraightPool (pOneName, pTwoName, pOnePoints, pTwoPoints, eventBus) {
    this.init(pOneName, pTwoName, pOnePoints, pTwoPoints, eventBus);

    this.rack = 15;
    this.gameState = gameStates.PLAYING;
    this.startedAt = new Date();
    this.endedAt = null;
    this.winner = null;
  }

  StraightPool.prototype = new PoolGame();

  StraightPool.prototype.foul = function () {
    this.activePlayer.losePoint();
    this.miss();
  };

  function OnePocket(pOneName, pTwoName, pOnePoints, pTwoPoints, eventBus) {
    this.init(pOneName, pTwoName, pOnePoints, pTwoPoints, eventBus);
    this.rack = 15;
    this.gameState = gameStates.PLAYING;
    this.startedAt = new Date();
    this.endedAt = null;
    this.winner = null;
  }

  OnePocket.prototype = new PoolGame();

  OnePocket.prototype.foul = function() {
    this.activePlayer.increaseDebt();
    this.miss();
  };
  
  OnePocket.prototype.switch = function() {
    var debtPaid = this.activePlayer.resolveDebt();
    while (debtPaid > 0) {
      this.incrementRack();
      debtPaid--;
    }
    switchPlayers.call(this);
  };

  exports.StraightPool = StraightPool;
  exports.OnePocket = OnePocket;
  exports.gameStates = gameStates;

})(this);