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
    this.debt = 0;
    this.run = 0;
    this.highRun = 0;
    this.misses = 0;
    this.safeties = 0,
    this.hasWon = false;
  }

  Player.prototype = {
    constructor: Player,
    addPoint: function () {
      this.points++;
      this.run++;
      this.checkHighRun();
      this.checkHasWon();
    },
    decrementRun: function() {
      this.run = this.run > 0
        ? this.run - 1
        : 0;
    },
    losePoint: function () {
      this.points = this.points > 0
        ? this.points - 1
        : 0;
      this.decrementRun();
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
      this.misses++;
    },
    increaseDebt: function() {
      this.debt++;
    },
    resolveDebt: function() {
      var paid = 0;
      while (this.points > 0 && this.debt > 0) {
        this.debt--;
        this.points--;
        paid++;
      }
      return paid;
    },
    safe: function () {
      this.safeties++;
      this.run = 0;
    }
  };

  exports.Player = Player;

})(this);