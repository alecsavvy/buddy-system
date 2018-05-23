const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(process.cwd(), 'public', 'index.html');

const server = express()
    .use((req, res) => res.sendFile(INDEX) )
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

var users = {}
counter = 0

io.on('connection', (socket) => {
    userkey = Date.now();
    users[userkey] = counter;
    counter += 1;
    var log = `Client `+ counter +` connected`
    console.log(log);
    socket.on('disconnect', () => console.log('Client' + users[userkey] +' disconnected'));
});

setInterval(() => io.emit('time', new Date().toString()), 1000);