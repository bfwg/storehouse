'use strict';

var Promise = require('bluebird');
var Store = require('./Store');
var engine = require('./engine');

class User extends Store {

  constructor(socket) {
    super();
    this.socket = socket;
    this.user = socket.handshake.query;
    this.userPrefix = `${this.user.role}:${this.user.userid}`;
    // this.socketPrefix = `${this.userPrefix}:socket`;
    this.roomsPrefix = `${this.userPrefix}:rooms`;
  }

  login() {
    var self = this;
    self.store.setSocket(self.userPrefix, self.socket);
    if (!self.user.role) {
      throw new Error('Unauthorized');
    } else if (self.user.role === 'operator') {
      Store.redisStore.multi()
        .set('room:123:type', 'chat')
        .set('room:234:type', 'private')
        .execAsync()
        .then(rs => self.joinRoom(234));
    }
    self.getCaches();
  }

  logout() {
    this.store.setSocket(this.userPrefix, null);
  }

  getRooms() {
    return this.store.smembersAsync(this.roomsPrefix);
  }

  joinRoom(roomId) {
    var self = this;
    return engine.getRoomTypeById(roomId)
      .then(RoomType => Promise.all([
        (new RoomType(roomId)).join(self.userPrefix),
        self.store.saddAsync(self.roomsPrefix, roomId)
      ]));
  }

  leaveRoom(roomId) {
    var self = this;
    return engine.getRoomTypeById(roomId)
      .then(RoomType => Promise.all([
        (new RoomType(roomId)).leave(self.userPrefix),
        self.store.sremAsync(self.roomsPrefix, roomId)
      ]));
  }

  getCaches() {
    var self = this;

    return this.getRooms()
      .map(roomId => {
        return engine.getRoomTypeById(roomId)
          .then(RoomType => (new RoomType(roomId)).getCache(self.userPrefix));
      });

  }

}

module.exports = User;
