const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'))

io.on('connection', function (socket) {
  console.log("Connected", socket.id)

  /*
  socket.on('disconnect', function() {
    clients.splice(clients.indexOf(client), 1)
    io.sockets.in(socket.room).emit('ADD_MESSAGE', {
      name: 'SERVER', text: `${socket.name} left the room.`
    })
  })
  */

  socket.on('NAME_CHANGE', function(name) {
    console.log('NAME_CHANGE', socket.id, name)
    socket.name = name
  })

  socket.on('ROOM_CHANGE', function(room) {
    console.log('ROOM_CHANGE', socket.id, room)

    if (room) {
      socket.leave(socket.room)
      socket.join(room)
      // socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
      // sent message to OLD room
      // socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.name+' has left this room');
      // update socket session room title
      socket.room = room.slice(0,10).replace(/[^0-9a-z]/gi, '')
      // socket.broadcast.to(room).emit('updatechat', 'SERVER', socket.name+' has joined this room');
      // socket.emit('updaterooms', rooms, newroom);
    }
  })

  socket.on('ADD_MESSAGE', function (message) {
    console.log('ADD_MESSAGE', socket.id, `[${socket.room}] ${socket.name}:`, message)

    socket.broadcast.to(socket.room).emit('ADD_MESSAGE', {
      name: socket.name, text: message
    })
  })
})

console.log('ReduxChat V1.0')
http.listen(port, () => console.log('Server: Port ' + port))
