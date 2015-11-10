'use strict';

var Promise = require('bluebird');
var Store = require('./Store');
var Utils = require('../Utils');

// room:count             id
//
// room:[id]:type = private.
// room:[id]:name         string
// room:[id]:msgs         hashs
//      - :[role]:[id] | refs=msg:[id]
// room:[id]:msgs:min     id
// room:[id]:members      sets
//      - :[role]:[id]

// "room:[id]:msg:[id]:time               string"
// "room:[id]:msg:[id]:from               :[role]:[id]"
// "room:[id]:msg:[id]:to                 room:[id]"    //:[to] is always be a room.
// "room:[id]:msg:[id]:payload            string"
// "room:[id]:msg:count                   id"

class PrivateRoom extends Store {

  constructor(id) {
    super();
    this.id = id;

    this.roomPrefix = `room:${id}`;
    this.roomCountPrefix = `room:count`;

    this.msgListPrefix = `room:${id}:msgs`;
    this.membersPrefix = `room:${id}:members`;
    this.msgCountPrifix = `room:${id}:msg:count`;
    this.msgPrefix = `room:${id}:msg`;
  }

  isMember(role) {
    return this.store.sismemberAsync(this.membersPrefix, role).catch(Utils.log);
  }

  getMembers() {
    return this.store.smembersAsync(this.membersPrefix).catch(Utils.log);
  }

  getNewMessageId() {
    return this.store.incrAsync(this.msgCountPrifix).catch(Utils.log);
  }

  getMessage(msgid) {
    var self = this;
    return self.store.hgetallAsync(`${self.msgPrefix}:${msgid}`)
      .then(msg => {
        if (msg) {
          msg.id = msgid;
          msg.payload = JSON.parse(msg.payload);
        }
        return msg;
      })
      .catch(Utils.log);
  }

  createMessage(role, payload) {
    var self = this;

    return self.store.hgetAsync(self.msgListPrefix, role)
      .then(msgid => {
        if (msgid > 0) throw new Error('message already exist.');
      })
      .then(() => self.getNewMessageId())
      .then(msgid => ({
        id: msgid,
        type: 'private',
        from: role,
        to: self.roomPrefix,
        payload: payload,
        time: Date.now()
      }))
      .then(msg => self.store.multi()
        .sadd(`${msg.from}:rooms`, self.id)
        .hmset(`${self.msgPrefix}:${msg.id}`,
          'type', msg.type,
          'from', msg.from,
          'to', msg.to,
          'payload', JSON.stringify(msg.payload),
          'time', msg.time
        )
        .hset(self.msgListPrefix, msg.from, msg.id)
        .execAsync()
        .then(rs => {
          self.broadcast(msg.from, 'cm', msg);
          return msg;
        })
      )
      .catch(Utils.log);
  }

  updateMessage(role, msgid, payload) {
    var self = this;
    return self.getMessage(msgid)
      .then(msg => {
        return self.store
          .hsetAsync(`${self.msgPrefix}:${msgid}`, 'payload', payload)
          .then(rs => {
            self.broadcast(role, 'um', msg);
            return rs;
          })
          .catch(Utils.log);
      });
  }

  deleteMessage(role, msgid) {
    var self = this;

    return self.getMessage(msgid)
      .then(msg => {
        return self.store.multi()
          .hdel(self.msgListPrefix, msg.from)
          .del(`${self.msgPrefix}:${msgid}`)
          .execAsync()
          .then(rs => {
            self.broadcast(role, 'dm', msg);
            return rs && rs.length === 2 && rs[0] === 1 && rs[1] === 1;
          });
      });
  }

  getCache(role) {
    var self = this;
    return self.isMember(role)
      .then(isMember => {
        if (isMember)
          return self.store
            .hgetallAsync(self.msgListPrefix)
            .then(msgs => {
              var promises = [];
              for (var k in msgs) {
                promises.push(self.getMessage(msgs[k]));
              }
              return Promise.all(promises);
            })
            .then(msgs => self.store.getSocket(role).emit(self.id, 'caches', msgs))
            .catch(Utils.log);
        else
          return self.store.hgetAsync(self.msgListPrefix, role)
            .then(msgid => self.getMessage(msgid)).then(msg => msg ? [msg] : [])
            .then(msgs => self.store.getSocket(role).emit(self.id, 'caches', msgs))
            .catch(Utils.log);
      });
  }

  broadcast(role, action, msg) {
    var self = this;
    return self.getMembers()
      .then(members => {
        if (members) {
          members.push(msg.from);
          var idx = members.indexOf(role);
          if (idx >= 0) members.splice(idx, 1);
        }
        members.forEach(m => {
          if (m)
            self.store.getSocket(m).emit(self.id, action, msg);
        });
      })
      .catch(Utils.log);
  }

  join(role) {
    return this.store.saddAsync(this.membersPrefix, role);
  }

  leave(role) {
    return this.store.sremAsync(this.membersPrefix, role);
  }

}

module.exports = PrivateRoom;
module.exports.ROOM_TYPE = 'private';

module.exports.authHandler = (req, res, next) => {
  next();
};

module.exports.actionHandler = (req, res, next) => {

  var crud = {
    cm: () => {
      var room = new PrivateRoom(req.roomid);
      room.createMessage(req.client.role.userPrefix, req.data).then(msg => res.send(msg));
    },

    dm: () => {
      var room = new PrivateRoom(req.roomid);
      room.deleteMessage(req.client.role.userPrefix, req.data).then(msg => res.send(msg));
    }
  };

  if (!crud[req.action]) return next(new Error('Unsuppored action: ' + req.action));
  crud[req.action]();

};
