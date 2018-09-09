const express = require('express');
const moment = require('moment');
const app = express();

const server = app.listen(3001, () => {
  console.log('server running on port 3001');
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('SIGN_IN', (data) => {
    let user_data = { user: data, socket_id: socket.id };

    io.emit('SIGNED_IN_USER', user_data);
  });
  
  socket.on('DISCONNECT', (data) => {
    let user_data = { user: data, socket_id: socket.id };
    io.emit('DISCONNECTED_USER', user_data);
  });
  
  socket.on('SEND_MESSAGE', (data) => {
    if(data.tagged_user){
      const REGEX = /(:::.*?:::)/;
      const now = moment().unix();
      data.message = data.message.replace(REGEX, `<span style="color: darkslateblue; background: #def; border-radius: 5px; padding: 2px 5px;" id="${data.socket_id}-${now}" class="user-tags">@${data.tagged_user}</span>`);
    }

    io.emit('MESSAGE', data);

    io.emit('REMOVE_TYPING', data.user);
  });

  socket.on('IS_TYPING', (data) => {
    socket.broadcast.emit('ADD_TYPING', data);
  });

  socket.on('disconnect', function() {
    io.emit('DISCONNECTED_USER', socket.id);
  });

  socket.on('NOTIFY_USER', (data) => {
    data.sender = socket.id;
    socket.broadcast.emit('NOTIFY', data);
  });
});

