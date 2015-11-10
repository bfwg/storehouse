var redisStore = require('./Store').redisStore;
var PrivateRoom = require('./PrivateRoom');
var Room = require('./Room');

function getRoomTypeById(id) {

  return Room.getRoomType(id)
    .then(roomType => {
      switch (roomType) {

      case Room.ROOM_TYPE:
        return Room;

      case PrivateRoom.ROOM_TYPE:
        return PrivateRoom;

      default:
        return null;
      }
    });
};

module.exports.getRoomTypeById = getRoomTypeById;


module.exports.roomReviver = (req, res, next) => {
  redisStore.multi()
    .set('room:123:type', 'chat')
    .set('room:234:type', 'private')
    .execAsync()
    .then(rs => next());
};

module.exports.authHandler = (req, res, next) => {
  getRoomTypeById(req.roomid)
    .then(room => {
      if (room)
        room.authHandler(req, res, next);
      else
        next(new Error(`room:${req.roomid}  does not exist.`));
    });
};

module.exports.actionHandler = (req, res, next) => {
  getRoomTypeById(req.roomid)
    .then(room => {
      if (room)
        room.actionHandler(req, res, next);
      else
        next(new Error(`room:${req.roomid}  does not exist.`));
    });
};
