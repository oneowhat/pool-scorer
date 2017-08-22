

var gameStates = {
  'PLAYING': 'PLAYING',
  'PAUSED': 'PAUSED',
  'DONE': 'DONE'
}

function StraightPool (pOneName, pTwoName, pOnePoints, pTwoPoints) {
  if (!pOneName) {
    console.error("Missing player 1 name")
  }
  if (!pTwoName) {
    console.error("Missing player 2 name")
  }
  if (!pOnePoints) {
    console.error("Missing player 1 points")
  }
  if (!pTwoPoints) {
    console.error("Missing player 2 points")
  }
  this.playerOne = new Player (pOneName, pOnePoints)
  this.playerTwo = new Player (pTwoName, pTwoPoints)
  this.activePlayer = this.playerOne
  this.rack = 15
  this.gameState = gameStates.PLAYING
  this.startedAt = new Date()
}

StraightPool.prototype = {
  constructor: StraightPool,
  switch: function() {
    this.activePlayer = this.activePlayer === this.playerOne
      ? this.playerTwo
      : this.playerOne
  },
  addPoint: function() {
    this.activePlayer.addPoint()
    this.decrementRack()
    if (this.activePlayer.hasWon()) {
      this.gameState = gameStates.OVER
    }
  },
  losePoint: function () {
    this.activePlayer.losePoint()
  },
  foul: function () {
    this.activePlayer.losePoint()
    this.activePlayer.miss()
  },
  miss: function () {
    this.activePlayer.miss()
    this.switch()
  },
  safe: function () {
    this.activePlayer.safe()
    this.switch()
  },
  incrementRack: function () {
    this.rack += 1
  },
  decrementRack: function () {
    this.rack -= 1;
    if (this.rack === 1) {
      this.gameState = gameStates.PAUSED
    }
  },
  newRack: function () {
    this.rack = 15
    this.gameState = gameStates.PLAYING
  },
  isPaused: function () {
    return this.gameState === gameStates.PAUSED
  }
}