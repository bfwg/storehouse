'use strict';

var Store = require('./protocol/Store');

class User extends Store {

  constructor(userid) {
    this.userid = userid;
    super();
  }

  update(cols) {
    var sql = 'UPDATE sys_user SET ? WHERE userid=?';
    return this.query(sql, [this.userid]);
  }

  addRankPoint(num) {
    var sql = 'UPDATE sys_user SET rank_point=rank_point+? WHERE userid=?';
    return this.query(sql, [num, this.userid]);
  }

  getDetail(num) {
    var sql = 'SELECT * FROM sys_user WHERE userid=?';
    return this.query(sql, [this.userid]);
  }

}

module.exports = User;
