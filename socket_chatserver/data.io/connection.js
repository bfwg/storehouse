'use strict';

var Q = require('q');
var Request = require('./request');
var Response = require('./response');

class Connection {

  constructor(resource, client) {
    this.resource = resource;
    this.client = client;
    this.promises = [];

    var self = this;
    var emitter = Object.create(this.resource);

    emitter.async = function() {
      var deferred = Q.defer();
      self.promises.push(deferred.promise);

      return function(err) {
        if (err) return deferred.reject(err);
        deferred.resolve();
      };
    };

    emitter.emit('connection', this.client);
  }

  sync(action, data, options, callback) {
    if (callback === undefined) {
      if (options === undefined && typeof data === 'function') {
        callback = data;
        data = {};
        options = {};
      } else if (typeof options === 'function') {
        callback = options;
        options = {};
      }
    }

    var self = this;

    var req = new Request(this, action, data, options);
    var res = new Response(action);

    res.on('error', function(err) {
      callback(err);
    });

    res.on('send', function(result) {
      callback(null, result);
    });

    var handle = function() {
      self.resource.handle(req, res, function(err) {
        if (err) return res.error(err);
        res.error(new Error('No handler for action: ' + req.action));
      });
    };

    // Wait until all promises are resolved before handling the request
    Q.all(this.promises).then(handle, callback);
  }

}

module.exports = Connection;
