'use strict';

/**
 * Module dependencies.
 */
var mysql = require('mysql');
var Promise = require('bluebird');

Promise.promisifyAll(mysql);
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

var env = process.env.NODE_ENV || 'development';


/**
 * Get database configured Json object via runtime enviroment.
 * @type {Object}
 */
var dbConfig = require('../config/db-' + env + '.json');

var pool_ = mysql.createPool(dbConfig.vanskydb);


/**
 * Initialize a new `PromisedMysql`.
 */
class PromisedMysql {

  /**
   * Return a promise with auto-release disposer.
   * @return {Promise}
   */
  getConnection() {
    return pool_.getConnectionAsync().disposer(function(connection) {
      connection.release();
    });
  }


  /**
   * Return a Promise that only contain result array when resolved.
   * @param  {String} sql
   * @param  {Array} params
   * @param  {Object} [connection]
   * @return {Promise.<Array>}
   */
  query(sql, params, connection) {
    return (connection || pool_).queryAsync(sql, params).then(function(rs) {
      return rs[0];
    });
  }


  /**
   * Return a Promise that only contain the first object in result array when resolved.
   * @param  {String} sql
   * @param  {Array} params
   * @param  {Object} [connection]
   * @return {Promise.<Object>}
   */
  queryFirstNode(sql, params, connection) {
    return (connection || pool_).queryAsync(sql, params).then(function(rs) {
      return rs[0][0];
    });
  }


  /**
   * @param  {String} sql
   * @param  {Array} params
   * @param  {Object} [connection]
   * @return {Promise.<String>}
   */
  queryField(sql, params, connection) {
    return (connection || pool_).queryAsync(sql, params).then(function(rs) {
      return rs[0][0][Object.keys(rs[0][0])[0]];
    });
  }

}


/**
 * Expose `PromisedMysql`.
 */
module.exports = PromisedMysql;
