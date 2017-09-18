(function(exports) {

  'use strict';

  function Player (name, points, eventBus) {
    if (!name) {
      console.error("Player missing name");
    }
    if (!points) {
      console.error("Player missing points, winAt will default to 0");
    }

    this.name = name || "Anon";
    this.winAt = points || 0;
    this.eventBus = eventBus;
    this.points = 0;
    this.run = 0;
    this.highRun = 0;
    this.misses = 0;
    this.safeties = 0,
    this.hasWon = false;
  }

  Player.prototype = {
    constructor: Player,
    addPoint: function () {
      this.points += 1;
      this.run += 1;
      this.checkHighRun();
      this.checkHasWon();
    },
    losePoint: function () {
      this.points = this.points > 0
        ? this.points - 1
        : 0;
      this.run = this.run > 0
        ? this.run - 1
        : 0;
    },
    checkHighRun: function () {
      if (this.run > this.highRun) {
        this.highRun = this.run;
      }
    },
    checkHasWon: function() {
      if (this.points >= this.winAt) {
        this.hasWon = true;
        if (this.eventBus) {
          this.eventBus.emit('playerWon', this);
        }
      }
    },
    miss: function () {
      this.run = 0;
      this.misses += 1;
    },
    safe: function () {
      this.safeties += 1;
      this.run = 0;
    }
  };

  exports.Player = Player;

})(this);