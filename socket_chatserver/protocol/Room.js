'use strict';

var Promise = require('bluebird');
var Store = require('./Store');
var Utils = require('../Utils');

// room:count             id
//
// room:[id]:type = chat
// room:[id]:name         string
// room:[id]:msgs         sorted sets
//      - room:[id]:msg:[id] | room:[id]:msg:[id]
// room:[id]:members      hashs
//      - :[role]:[id] | refs=msg:[id]
//
// "room:[id]:msg:[id]:time               string"
// "room:[id]:msg:[id]:from               :[role]:[id]"
// "room:[id]:msg:[id]:to                 room:[id]"    //:[to] is always be a room.
// "room:[id]:msg:[id]:payload            string"
// "room:[id]:msg:count                   id"


class Room extends Store {

  constructor(id) {
    super();
    this.id = id;

    this.roomPrefix = `room:${id}`;
    this.roomCountPrefix = `room:count`;

    this.msgListPrefix = `room:${id}:msgs`;
    this.msgCountPrefix = `room:${id}:msg:count`;
    this.msgPrefix = `room:${id}:msg`;

    this.membersPrefix = `room:${id}:members`;
  }

  static getRoomType(id) {
    return Store.redisStore.getAsync(`room:${id}:type`);
  }

  getMembers() {
    return this.store.hkeysAsync(this.membersPrefix).catch(Utils.log);
  }

  getNewMessageId() {
    return this.store.incrAsync(this.msgCountPrefix).catch(Utils.log);
  }

  createMessage(role, payload) {
    var self = this;

    return self.getNewMessageId()
      .then(msgid => ({
        id: msgid,
        type: 'chat',
        from: role,
        to: self.roomPrefix,
        payload: payload,
        time: Date.now()
      }))
      .then(msg => {
        return self.store.multi()
          .hmset(`${self.msgPrefix}:${msg.id}`,
            'type', msg.type,
            'from', msg.from,
            'to', msg.to,
            'payload', JSON.stringify(msg.payload),
            'time', msg.time
          )
          .zadd(self.msgListPrefix, msg.id, msg.id)
          .hincrby(self.membersPrefix, role, 1)
          .execAsync()
          .then(rs => {
            self.broadcast(role, 'cm', msg);
            return msg;
          });
      })
      .catch(Utils.log);
  }


  broadcast(role, action, msg) {
    var self = this;
    return self.getMembers()
      .then(members => {
        if (members) {
          if (members) {
            var idx = members.indexOf(role);
            if (idx >= 0) members.splice(idx, 1);
          }
          members.forEach(function(m) {
            if (m)
              self.store.getSocket(m).emit(self.id, action, msg, function(result) {
                self.store.hincrbyAsync(self.membersPrefix, m, 1);
              });
          });
        }
      })
      .catch(Utils.log);
  }

  getCache(role) {
    var self = this;
    return self.store.hgetAsync(self.membersPrefix, role)
      .then(ref => self.store.zrangebyscoreAsync(self.msgListPrefix, '(' + ref, '+inf'))
      .map(i => {
        return self.store.hgetallAsync(`${self.msgPrefix}:${i}`)
          .then(res => {
            res.id = i;
            return res;
          });
      })
      .then(msgs => self.store.getSocket(role).emit(self.id, 'caches', msgs, function(result) {
        self.store.hincrbyAsync(self.membersPrefix, role, msgs.length);
      }));
  }

  cleanCache() {
    var self = this;
    //get the smallest
    return self.store.hvalsAsync(self.membersPrefix)
    .then(ls => {
      var minRef = Math.min.apply(null, ls);
      return minRef;
    })
    //trim the no use cache msgs
    //mr = mininum ref
    .then(mr => {
      console.log(`smallest reg is now ${mr}`);
      console.log(`Triming...`);
      return Promise.all([self.store.ltrimAsync(self.msgListPrefix, mr, -1), self.getMembers()])
    //update all user refs
      .then((res) => res[1])
      .map(m => {
        console.log(`room:${self.id}:members, ${Object.keys(m)[0]}, ${(parseInt(mr) * -1)}`);
        return self.store.hincrbyAsync(`room:${self.id}:members`, Object.keys(m)[0], (parseInt(mr) * -1));
      });
    })
    .then((resOfUpdate) => {
      console.log({resOfUpdate});
      // self.store.hincrbyAsync(self.targetRoom, userid, (parseInt(mrf) * -1)));
      return self.store.lrangeAsync(self.msgListPrefix, 0, -1);
    });
  }

  // getMinRef() {
    // return this.store.hgetAsync('msg:min', this.id);
  // }

  // cleanCache(userid) {

    // this.store.hincrbyAsync(this.targetRoom, userid, (parseInt(mrf) * -1)));

    // return this.setMinRef()
    // .then(mrf => {
      // console.log(`the min ref is ${mrf}`);
      // return Promise.all([this.store.ltrimAsync(this.msgListPrefix, mrf, -1),     })
    // .then(() => this.store.lrangeAsync(this.msgListPrefix, 0, -1));

  // }

  getMsgCount() {
    return this.store.getAsync(this.msgCountPrefix)
      .then(count => count ? count : 0);
  }

  join(role) {
    var self = this;
    return self.getMsgCount()
      .then(len => self.store.hsetAsync(self.membersPrefix, role, len));
  }

  leave(role) {
    return this.store.hdelAsync(this.membersPrefix, role);
  }

}

module.exports = Room;
module.exports.ROOM_TYPE = 'chat';

module.exports.authHandler = function(req, res, next) {
  next();
};

module.exports.actionHandler = function(req, res, next) {

  var crud = {
    cm: function() {
      var room = new Room(req.roomid);
      room.createMessage(req.client.role.userPrefix, req.data)
        .then(msg => res.send(msg));
    },

    join: function() {
      req.client.role.joinRoom(req.roomid);
    }
  };

  if (!crud[req.action]) return next(new Error('Unsuppored action: ' + req.action));
  crud[req.action]();

};
