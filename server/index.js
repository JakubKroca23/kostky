import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for dev
        methods: ["GET", "POST"]
    }
});

// Game State
const rooms = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', ({ roomId, username }) => {
        socket.join(roomId);

        // Initialize room if not exists
        if (!rooms[roomId]) {
            rooms[roomId] = {
                players: {},
                rolls: {} // Store latest roll for each player
            };
        }

        // Add player
        rooms[roomId].players[socket.id] = {
            id: socket.id,
            username,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        };

        // Notify room
        io.to(roomId).emit('update-game-state', rooms[roomId]);
        console.log(`${username} joined room ${roomId}`);
    });

    socket.on('roll-dice', ({ roomId, forces }) => {
        // Broadcast throw forces to all clients in room to simulate physics
        // forces: array of vectors for each die
        io.to(roomId).emit('player-rolled', {
            playerId: socket.id,
            forces
        });
    });

    socket.on('dice-result', ({ roomId, results }) => {
        // Player client reports where dice stopped
        if (rooms[roomId] && rooms[roomId].players[socket.id]) {
            rooms[roomId].rolls[socket.id] = results;
            io.to(roomId).emit('update-game-state', rooms[roomId]);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Find room user was in
        for (const roomId in rooms) {
            if (rooms[roomId].players[socket.id]) {
                delete rooms[roomId].players[socket.id];
                delete rooms[roomId].rolls[socket.id]; // Optional: clear roll on leave
                if (Object.keys(rooms[roomId].players).length === 0) {
                    delete rooms[roomId];
                } else {
                    io.to(roomId).emit('update-game-state', rooms[roomId]);
                }
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

