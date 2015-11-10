'use strict';

var Resource = require('./resource');
var Connection = require('./connection');

class Server {

  constructor(io) {
    this.io = io;
    this.resources = {};
  }

  namespace(name) {
    return this.io.of(name);
  }

  resource(name, resource) {
    var self = this;

    if (resource === undefined) {
      resource = this.resources[name];
      if (resource) return resource;
      resource = new Resource(name);
    }

    this.resources[name] = resource;

    this.namespace(name).on('connection', function(client) {
      self.connect(resource, client);
    });

    return resource;
  }

  connect(resource, client) {
    var connection = new Connection(resource, client);

    client.on('sync', function() {
      var args = [].slice.apply(arguments);
      connection.sync.apply(connection, args);
    });

    return connection;
  }

}

module.exports = Server;
