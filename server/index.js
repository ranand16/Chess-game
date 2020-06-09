const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const { uuid } = require('uuidv4');

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const socket = socketio(server);

let rooms = [];
let users = [];
socket.on('connection', (socket)=>{
    socket.on('joinroom', ({userName, roomName}, type="join", callback)=>{
        const response = { status: true, data: {} }
        let room; let user;
        try {
            // create a user object
            if(userName) user = { id: uuid(), name: userName } 
            else throw { status: false, data: "User name is mandatory." }
            // check ${room}'s availability(created already or not)
            if(!roomName) throw { status: false, data: "Room name is mandatory." }
            room = rooms.find(room => room.name === roomName);
            if(room && type==="join" ) {// There is a room which is already created. So this is JOIN
                room["spectators"].push(user)
            } else if(!room && type==="create") { // A new room is going to be created
                room = { id: uuid(), name: roomName, spectators: [user], players: [] }
                rooms.push(room)
            }
            // add this user's details
            users.push(user);
            response["data"] = {room, user}
            callback(response)
            console.log(`Current rooms`);
            console.log(rooms);
            console.log(`Current users`); 
            console.log(users);
        } catch(err) {
            response["status"] = false
            response["data"] = err["data"] || "There was some kind of error."
            callback(response)
        }
    });
    socket.on('participate', (userId, roomId, callback)=>{
        let room; let user; let response = {status: true, data: {}};
        try{ 
            if(!userId && !roomId) throw { status: false, data: "User id and Room id is mandatory." }
            room = romms.find(room => room.id === roomId)
            user = users.find(user => user.id === userId)
            if(!room && !user) throw { status: false, data: "User and Room were not found in the database." }
            if(room["players"].length < 2) room["players"].push(user)
            response["data"] = `Player ${user.name} is a participant now.`
        } catch(err) {
            response["status"] = false
            response["data"] = err["data"] || "There was some kind of error."
        }
        callback(response)

    })
    socket.on('disconnect', (name, room)=>{
        console.log(`${name} wants to disconnect from the room name ${room}`);
        // callback(name, room);
    });
});
server.listen(PORT, ()=>{
    console.log(`server running at ${PORT}`)
});