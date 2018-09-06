const express = require('express');
const app = express();

const server = app.listen(3001, function() {
    console.log('server running on port 3001');
});

const io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log(socket.id)
    socket.on('SEND_MESSAGE', function(data) {
        io.emit('MESSAGE', data)
    });

    socket.on('IS_TYPING', function(data) {
      io.emit('ADD_TYPING', data)
    });

    socket.on('IS_NOT_TYPING', function(data) {
      io.emit('REMOVE_TYPING', data)
    });
});

