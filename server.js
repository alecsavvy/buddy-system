const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const uuid = require('uuid/v1')

const PORT = process.env.PORT || 3000;
const INDEX = path.join(process.cwd(), 'public', 'index.html');

const server = express()
    .use((req, res) => res.sendFile(INDEX) )
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

var users = {};

io.on('connection', (socket) => {
    userid = uuid();
    loginUser(userid); // User logged in.
    socket.emit('user', userid);
    socket.on('loc', function(location){
        users[location.id]['currentLocation'] = {
            latitude: location.lat,
            longitude: location.lng
        }
        console.log('User: ' + location.id);
        console.log('at: ' + users[location.id]['currentLocation']['latitude'] + ', ' + users[location.id]['currentLocation']['longitude'])
    });
    socket.on('disconnect', () => console.log('Client disconnected'));
});

function loginUser(id){
    // Here would be a function that would validate
    // UO id and password before allowing access.
    // Ommitting for demonstration purposes.
    users[id] = {
        'currentLocation': {
          'latitude': "None set",
          'longitude': "None set"  
        },
        'destination': {
            'latitude': "None set",
            'longitude': "None set"
        }
    };
}

setInterval(() => io.emit('time', new Date().toString()), 1000);