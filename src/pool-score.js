var ps = (function () {

  var modes = {
    'NEW': 'NEW',
    'CREATING': 'CREATING',
    'IN_PROGRESS': 'IN_PROGRESS',
    'REPORTING': 'REPORTING'
  }

  var games = {
    "STRAIGHT_POOL": { 'id': 'STRAIGHT_POOL', 'name': 'Straight pool/14.1 continuous', 'points': 125 },
    "ONE_POCKET": { 'id': 'ONE_POCKET', 'name': 'One pocket', 'points': 8 }
  }

  var playerStatuses = {
    'PLAYING': 'PLAYING',
    'WON': 'WON',
    'LOST': 'LOST'
  }

  function byId (id) {
    return document.getElementById(id)
  }

  function init () {
    var eventBus = new EventBus()
    var defaultPlayer = new Player("default", 125, eventBus)

    Vue.component('player', {
      template: '#player-template',
      props: [
        'player',
        'disabled'
      ],
      methods: {
        addPoint: function () {
          this.$emit('add-point')
        },
        losePoint: function () {
          this.$emit('lose-point')
        },
        miss: function () {
          this.$emit('miss')
        },
        safe: function () {
          this.$emit('safe')
        },
        foul: function () {
          this.$emit('foul')
        }
      }
    })

    var app = new Vue({
      el: '#app',
      data: {
        availableGames: [
          games.STRAIGHT_POOL,
          //games.ONE_POCKET
        ],
        mode: modes.NEW,
        editor: {
          selectedGame: '',
          playerOne: 'Player one',
          playerOneTarget: null,
          playerTwo: 'Player two',
          playerTwoTarget: null
        },
        game: {
          playerOne: defaultPlayer,
          playerTwo: defaultPlayer
        }
      },
      computed: {
        showEditor: function () {
          return this.mode === modes.CREATING
        },
        showNewButton: function () {
          return this.mode === modes.NEW
        },
        showStraightPool: function () {
          return this.mode === modes.IN_PROGRESS
              && this.game instanceof StraightPool
        },
        showFinal: function () {
          return this.mode === modes.REPORTING
        },
        isPaused: function () {
          return this.game.gameState === gameStates.PAUSED
        },
        isOver: function () {
          return this.game.gameState === gameStates.OVER
        }
      },
      methods: {
        addPoint: function () {
          this.game.addPoint()
        },
        losePoint: function () {
          this.game.losePoint()
        },
        miss: function () {
          this.game.miss()
        },
        safe: function () {
          this.game.safe()
        },
        foul: function () {
          this.game.foul()
        },
        newGame: function () {
          this.mode = modes.CREATING
        },
        newRack: function () {
          this.game.newRack()
        },
        startGame: function () {
          if (this.editor.selectedGame === games.STRAIGHT_POOL.id) {
            this.startStraightPool()
          }
          else if (this.editor.selectedGame === games.ONE_POCKET.id) {
            this.startOnePocket()
          }
          this.mode = modes.IN_PROGRESS
        },
        startStraightPool: function () {
          this.game = new StraightPool(
            this.editor.playerOne,
            this.editor.playerTwo,
            this.editor.playerOneTarget * 1,
            this.editor.playerTwoTarget * 1,
            eventBus
          )
        },
        startOnePocket: function () {
          console.log("not implemented")
        },
        isActivePlayer: function (player) {
          return player === this.game.activePlayer;
        },
        isWinningPlayer: function (player) {
          return player.hasWon
        },
        isDisabled: function (player) {
          return this.isPaused || !this.isActivePlayer(player)
        },
        finishGame: function () {
          this.mode = modes.REPORTING
        },
        materialIconFor: function (val) {
          return val === true ? 'check' : 'remove'
        }
      },
      watch: {
        'editor.selectedGame': function (val) {
          var event = new Event('input', {
            'bubbles': true,
            'cancelable': true
          })

          this.editor.playerOneTarget = games[val].points
          this.editor.playerTwoTarget = games[val].points

          // hack to make the MDL labels for these inputs disappear
          this.$nextTick(function () {
            byId('playerOneTarget').dispatchEvent(event)
            byId('playerTwoTarget').dispatchEvent(event)
          })
        }
      }
    })
  }

  return {
    init: init
  }

})()
