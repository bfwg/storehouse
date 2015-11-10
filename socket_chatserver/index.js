'use strict';

var express = require('express');
var path = require('path');
var app = express();
var PORT = process.env.PORT || 3000;
var server = app.listen(PORT, '192.168.0.12', function() {
  console.log('node ' + process.version + ' listen on port ' + PORT + '(' + process.env.NODE_ENV + ')');
});

app.use(express.static(path.join(__dirname) + '/static'));


var io = require('socket.io').listen(server);
var engine = require('./data.io')(io);
var roomEngine = engine.resource('room.io');
var protocol = require('./protocol');
var User = require('./protocol/User');

roomEngine.on('connection', function(socket) {
  socket.role = new User(socket);
  socket.role.login();

  socket.on('disconnect', function () {
      // console.log(socket.role.userPrefix, 'disconnected');
    });
});


roomEngine.use(protocol.roomReviver);
roomEngine.use(protocol.authHandler);
roomEngine.use(protocol.actionHandler);
