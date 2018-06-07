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

var startingPoint;
var endingPoint;

io.on('connection', (socket) => {
    userid = uuid();
    loginUser(userid); // User logged in.
    socket.emit('user', userid);
    socket.on('loc', function(location){
        users[location.id]['currentLocation'] = {
            latitude: location.lat,
            longitude: location.lng,
            ready: false,
        }
        console.log('\nUser: ' + location.id);
        console.log('at: ' + users[location.id]['currentLocation']['latitude'] + ', ' + users[location.id]['currentLocation']['longitude'])
    });
    socket.on('del_user', function(uid){
        delete users[uid];
        console.log(uid + 'disconnected');
    });
    socket.on('dest', function(destination){
        users[destination.id]['destination'] = {
            latitude: destination.lat,
            longitude: destination.lng
        }
    });
    socket.on('ready', function(id){
        users[id.id]['ready'] = true;
        if (checkAllReady(users)){
            console.log('all users ready');
            allReady();
        }
        else{
            console.log('not all users ready');
        }
    })
    socket.on('disconnect', () => console.log('disconnected'));
});

function checkAllReady(user_list){
    var checked = true;
    for (var id in user_list){
        if (user_list[id]['ready']){
            console.log(id, "=ready")
        } else{
            checked = false;
        }
    }
    return checked;
}

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

function findStartingPoint(user_list){
    sum_lat = 0;
    sum_lng = 0;
    counter = 0;
    for (var key in user_list){
        sum_lat += user_list[key]['currentLocation']['latitude'];
        sum_lng += user_list[key]['currentLocation']['longitude'];
        counter += 1;
    }
    lat = sum_lat/counter;
    lng = sum_lng/counter;
    return {
        lat: lat,
        lng: lng
    }
}

function findEndingPoint(destination_list){
    sum_lat = 0;
    sum_lng = 0;
    counter = 0;
    for (var key in destination_list){
        sum_lat += destination_list[key]['destination']['latitude'];
        sum_lng += destination_list[key]['destination']['longitude'];
        counter += 1;
    }
    lat = sum_lat/counter;
    lng = sum_lng/counter;
    return {
        lat: lat,
        lng: lng
    }
}

function allReady(){
    console.log('allready called')
    startingPoint = findStartingPoint(users);
    endingPoint = findEndingPoint(users);
    console.log(startingPoint)
    console.log(endingPoint)
    readyCoords =  {
        start: startingPoint,
        end: endingPoint
    }
    io.emit('all_ready', readyCoords);
}

setInterval(() => io.emit('time', new Date().toString()), 1000);
setInterval(() => io.emit('broadcast_users', users), 5000);
//setInterval(() => {console.log(users)}, 5000);

