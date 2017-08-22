(function (exports) {

  'use strict'

  function EventBus() {
    this.handlers = {}
  }

  EventBus.prototype = {
    constructor: EventBus,
    on: function(name, action) {
      if (!this.handlers.hasOwnProperty(name)) {
        this.handlers[name] = []
      }
      this.handlers[name].push(action)
    },
    emit: function(name) {
      var i
      var args = [].slice.call(arguments, 1)
      if (this.handlers.hasOwnProperty(name)) {
        this.handlers[name].forEach(function(handler) {
          handler.apply(null, args)
        })
      }
    }
  }

  exports.EventBus = EventBus

})(this)