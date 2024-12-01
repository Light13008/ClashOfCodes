const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Join a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User  joined room: ${room}`);
        // Notify the user that they have joined the room
        socket.emit('message', { message: `You joined room: ${room}` });
    });

    // Listen for chat messages
    socket.on('chatMessage', (msg) => {
        const room = msg.room;
        io.to(room).emit('message', { message: msg.message });
    });

    // Handle WebRTC signaling
    socket.on('webrtcOffer', (data) => {
        socket.to(data.room).emit('webrtcOffer', {
            offer: data.offer,
            from: socket.id,
            room: data.room
        });
    });

    socket.on('webrtcAnswer', (data) => {
        socket.to(data.room).emit('webrtcAnswer', {
            answer: data.answer,
            from: socket.id,
            room: data.room
        });
    });

    socket.on('iceCandidate', (data) => {
        socket.to(data.room).emit('iceCandidate', {
            candidate: data.candidate,
            from: socket.id,
            room: data.room
        });
    });

    // Handle drawing events
    socket.on('drawing', (data) => {
        socket.to(data.room).emit('drawing', data);
    });

    // Handle clear canvas event
    socket.on('clearCanvas', (data) => {
        socket.to(data.room).emit('clearCanvas');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User  disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});