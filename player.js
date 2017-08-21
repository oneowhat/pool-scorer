function Player (name, points) {
  this.name = name || ""
  this.winAt = points || 0
  this.score = 0
  this.run = 0
  this.highRun = 0
  this.misses = 0
  this.safeties = 0
}

Player.prototype = {
  constructor: Player,
  addPoint: function () {
    this.score += 1
    this.run += 1
    this.checkHighRun()
  },
  losePoint: function () {
    this.score = this.score > 0
      ? this.score - 1
      : 0
    this.run = this.run > 0
      ? this.run - 1
      : 0
  },
  checkHighRun: function () {
    if (this.run > this.highRun) {
      this.highRun = this.run
    }
  },
  miss: function () {
    this.run = 0
    this.misses += 1
  },
  safe: function () {
    this.safeties += 1
    this.run = 0
  },
  hasWon: function () {
    return this.score >= this.winAt
  }
}

module.exports = Player