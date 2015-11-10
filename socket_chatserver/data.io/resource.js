'use strict';

var EventEmitter = require('events').EventEmitter;

class Resource extends EventEmitter {

  constructor(name) {
    super();
    this.name = name;
    this.stack = [];
  }

  use() {
    var args = [].slice.call(arguments);
    var fn = args.pop();
    var actions = args.length ? args : ['*'];
    this.stack.push({actions: actions, fn: fn});
  }

  handle(req, res, callback) {
    var self = this;
    var index = 0;

    function next(err) {
      var layer = self.stack[index++];

      if (!layer) {
        if (callback) callback(err);
        return;
      }

      var valid = function(action) {
        return layer.actions.indexOf(action) !== -1;
      };

      if (valid(req.action) || valid('*')) {
        try {
          if (err) {
            if (layer.fn.length === 4) {
              layer.fn(err, req, res, next);
            } else {
              next(err);
            }
          } else {
            layer.fn(req, res, next);
          }
        } catch (err) {
          next(err);
        }
      } else {
        next(err);
      }
    }

    next();
  }

}

module.exports = Resource;

