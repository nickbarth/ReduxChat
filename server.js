const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'))

io.on('connection', function (socket) {
  console.log("Connected", socket.id)

  socket.on('disconnect', function() {
    io.sockets.in(socket.room).emit('ADD_MESSAGE', {
      name: 'SERVER', text: `${socket.name} left the room.`
    })
  })

  socket.on('NAME_CHANGE', function(name) {
    console.log('NAME_CHANGE', socket.id, name)
    socket.name = name.slice(0,10).replace(/[^0-9a-z]/gi, '')
  })

  socket.on('ROOM_CHANGE', function(room) {
    console.log('ROOM_CHANGE', socket.id, room)

    if (room) {
      socket.leave(socket.room)
      socket.join(room)
      socket.room = room.slice(0,10).replace(/[^0-9a-z]/gi, '')

      io.sockets.in(socket.room).emit('ADD_MESSAGE', {
        name: 'SERVER', text: `${socket.name} joined the room.`
      })
    }
  })

  socket.on('ADD_MESSAGE', function (message) {
    console.log('ADD_MESSAGE', socket.id, `[${socket.room}] ${socket.name}:`, message)

    socket.broadcast.to(socket.room).emit('ADD_MESSAGE', {
      name: socket.name, text: message.slice(0,200).replace(/[^0-9a-zA-Z ]/gi, '')
    })
  })
})

console.log('ReduxChat V1.0')
http.listen(port, () => console.log('Server: Port ' + port))
