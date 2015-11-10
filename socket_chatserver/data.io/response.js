'use strict';

var EventEmitter = require('events').EventEmitter;

class Response extends EventEmitter {

  constructor(action, options) {
    super();
    options || (options = {});
    this.options = options;

    this.action = action;
  }

  send(result) {
    this.emit('send', result);
    return this;
  };

  error(err) {
    var error = {type: err.name, message: err.message};

    for (var key in err) {
      error[key] = err[key];
    }

    if (this.options.debug) {
      error.stack = err.stack;
    }

    this.emit('error', error);
  }

}

module.exports = Response;
