'use strict';

class Request {

  constructor(connection, action, data, options) {
    this.connection = connection;
    this.action = action;
    this.data = data;
    this.client = connection.client;
    this.resource = connection.resource;
    this.store = {};

    for (var key in options) {
      this[key] = options[key];
    }
  }

  set(key, value) {
    this.store[key] = value;
  }

  get(key) {
    return this.store[key];
  }

}

module.exports = Request;
