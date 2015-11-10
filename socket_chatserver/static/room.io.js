(function (name, root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root[name] = factory();
  }
}('RoomClient', this, function () {

  function Room(id, socket) {
    EventEmitter.call(this);
    var self = this;
    this.id = id;
    this.socket = socket;
    console.log(this.id);
    this.socket.on(this.id, function (action, data, cb) {
      self.emit(action, data);
      console.log(arguments);
      if (cb) cb('ok');
    });
  }

  Room.prototype = new EventEmitter;

  Room.prototype.send = function (action, data, callback) {
    // this.socket.emit(action, this.id, data, callback);
    this.socket.emit('sync', action, data, {roomid: this.id}, callback);
  };

  return function (socket) {
    var rooms = {};
    return {
      add: function (id) {
        if (rooms[id]) return rooms[id];
        rooms[id] = new Room(id, socket);
        return rooms[id];
      },
      get: function(id) {
        return rooms[id];
      }
    };
  };

}));
