'use strict';

var expect = chai.expect;

describe('Player', function() {

  var sandbox;
  var player;
  
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(window.console, "error");
    player = new Player("Tester", 1);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    var p = new Player();
    expect(p).to.not.be.undefined; 
  });

  describe('constructor', function() {
    it('should have a default name', function() {
      var p = new Player();
      expect(p.name).to.equal("Anon");
    });
    it('should use a name if provided', function() {
      var p = new Player("Tester");
      expect(p.name).to.equal("Tester");
    });
    it('should use winAt points if provided', function() {
      var p = new Player("Tester", 125);
      expect(p.winAt).to.equal(125);
    });
    it('should log error if no name is passed', function() {
      var p = new Player(undefined, 1);
      sinon.assert.calledOnce(console.error);
      sinon.assert.calledWithExactly(console.error, "Player missing name");
    });
    it('should log error if no points value is passed', function() {
      var p = new Player("Tester");
      sinon.assert.calledOnce(console.error);
      sinon.assert.calledWithExactly(console.error, "Player missing points, winAt will default to 0");
    });
  });

  describe('#addPoint', function() {
    it('increases the points by one', function() {
      var originalScore = player.points;
      player.addPoint();
      expect(player.points).to.equal(originalScore + 1);
    });
    it('increases the current run by one', function() {
      var originalRun = player.run;
      player.addPoint();
      expect(player.run).to.equal(originalRun + 1);
    });
    it('should set high run if greater than current high', function() {
      var originalRun = player.run;
      player.addPoint();
      expect(player.run).to.equal(player.highRun);
    });
    it('set hasWon to true if points >= winAt', function() {
      player.addPoint();
      expect(player.hasWon).to.equal(true);
    });
  });
  
  describe('#losePoint', function() {
    it('decreases the points by one', function() {
      player.points = 12;
      player.losePoint();
      expect(player.points).to.equal(11);
    });
    it('decreases the current run by one', function() {
      player.run = 12;
      player.losePoint();
      expect(player.run).to.equal(11);
    });
    it('should never be negative', function() {
      var p = new Player();
      player.losePoint();
      expect(player.points).to.equal(0);
    });
  });

  describe('#miss', function() {
    it('should set the current run to 0', function() {
      player.addPoint();
      player.miss();
      expect(player.run).to.equal(0);
    });
    it('should increase the miss count by 1', function() {
      player.addPoint();
      player.miss();
      expect(player.misses).to.equal(1);
    });
  });
  
  describe('#safe', function() {
    it('should set the current run to 0', function() {
      player.addPoint();
      player.safe();
      expect(player.run).to.equal(0);
    });
    it('should increase the safety count by 1', function() {
      player.addPoint();
      player.safe();
      expect(player.safeties).to.equal(1);
    });
  });

  describe('#increaseDebt', function() {
    it('should increase debt by 1', function() {
      player.increaseDebt();
      expect(player.debt).to.equal(1);
    });
  });
  
  describe('#resolveDebt', function() {
    it('should do nothing if debt is 0', function() {
      player.resolveDebt();
      expect(player.debt).to.equal(0);
      expect(player.points).to.equal(0);
    });
    it('should pay debt with points', function() {
      player.increaseDebt();
      player.addPoint();
      player.addPoint();
      player.resolveDebt();
      expect(player.debt).to.equal(0);
      expect(player.points).to.equal(1);
    });
    it('should return the amount of the debt paid', function() {
      var actual = 0;
      player.increaseDebt();
      player.increaseDebt();
      player.addPoint();
      player.addPoint();
      actual = player.resolveDebt();
      expect(actual).to.equal(2);
    });
  });
});