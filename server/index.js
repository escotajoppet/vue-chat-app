const express = require('express');
const app = express();
let users = [];

const server = app.listen(3001, () => {
  console.log('server running on port 3001');
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('SIGN_IN', (data) => {
    let user_data = { "user": data, "socket_id": socket.id };
    io.emit('SIGNED_IN_USER', user_data);
  });
  
  socket.on('DISCONNECT', (data) => {
    let user_data = { "user": data, "socket_id": socket.id };
    io.emit('DISCONNECTED_USER', user_data);
  });
  
  socket.on('SEND_MESSAGE', (data) => {
    io.emit('MESSAGE', data);
    io.emit('REMOVE_TYPING', data);
  });

  socket.on('IS_TYPING', (data) => {
    socket.broadcast.emit('ADD_TYPING', data);
  });

  socket.on('disconnect', function() {
    io.emit('DISCONNECTED_USER', socket.id);
  });
});

