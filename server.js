const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

function onConnection(socket){
}

io.on('connection', onConnection);

console.log('ReduxChat V1.0')
http.listen(port, () => console.log('Server: Port ' + port));
