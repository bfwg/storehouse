'use strict';

// var redis = require('fakeredis');
var PromisedMysql = require('./PromisedMysql');
var redis = require('redis');
var Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

var store = redis.createClient({
  // host: 'redis',
  host: '127.0.0.1',
  port: 6379
});

var socketPool = {};

class Store extends PromisedMysql {

  constructor() {
    super();

    this.store = store;

    this.store.getSocket = (role) => {
      return socketPool[role];
    };

    this.store.setSocket = (role, socket) => {
      socketPool[role] = socket;
      return socket;
    };

  }
}

module.exports = Store;
module.exports.redisStore = store;
