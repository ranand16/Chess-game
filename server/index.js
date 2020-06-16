const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const { uuid } = require('uuidv4');

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const socketserve = socketio(server);

let rooms = [];
let users = [];
socketserve.on('connection', (socket)=>{
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
                room = { id: uuid(), name: roomName, spectators: [user], players: ["", ""] }
                rooms.push(room)
            }
            // add this user's details
            users.push(user);
            socket.join(room.id);
            socketserve.sockets.in(room.id).emit('updateState', { room })
            response["data"] = {room, user}
            callback(response)
        } catch(err) {
            response["status"] = false
            response["data"] = err["data"] || "There was some kind of error."
            callback(response)
        }
    });
    socket.on('participate', (userId, roomId, playerSide, callback)=>{
        let room; let user; let response = {status: true, data: {}}; let roomIndex; let userIndex; 
        console.log(userId, roomId, playerSide, callback)
        try{ 
            if(!userId && !roomId) throw { status: false, data: "User id and Room id is mandatory." }
            room = rooms.find((currRoom, i) => {
                roomIndex = i;
                return (currRoom.id == roomId);
            })
            user = users.find((user, j) => {
                userIndex = j;
                return (user.id == userId);
            })
            // room["spectators"].find()
            if(!room && !user) throw { status: false, data: "User and Room were not found in the database." }
            console.log(playerSide, room["players"], room["players"][0], room["players"][1])
            if(room["players"].length <= 2) { 
                if(playerSide === "dark" && room["players"][0]==="") room["players"][0] = user;
                else if(playerSide === "white" && room["players"][1]==="") room["players"][1] = user;
            }
            console.log(room)
            socketserve.sockets.in(room.id).emit('updateState', { room })
            response["data"] = { players: room["players"], room }
            callback(response)
        } catch(err) {
            response["status"] = false
            console.log(err)
            response["data"] = err["data"] || "There was some kind of error."
            callback(response)
        }
    });
    socket.on('disconnect', (name, room)=>{
        console.log(`${name} wants to disconnect from the room name ${room}`);
    });
    // socket.on('updateState', (roomId, callback)=>{
    //     room = rooms.find(currRoom => currRoom.id == roomId)
    //     callback(room)
    // });
});
server.listen(PORT, ()=>{
    console.log(`server running at ${PORT}`)
});