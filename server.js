const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*', //  In a real application, restrict this to your actual domain
        methods: ["GET", "POST"]
    }
});

const boardState = []; // Store the drawing data

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the current board state to the new client
    socket.emit('boardUpdate', boardState);

    socket.on('draw', (data) => {
        boardState.push(data); // Add the new drawing to the board state
        socket.broadcast.emit('draw', data); // Broadcast to all OTHER clients
    });

    socket.on('clearBoard', () => {
        boardState.length = 0; // Clear the board state
        io.emit('clearBoard'); // Tell all clients to clear their canvas
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});