import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/auth.js';
import { Room } from './models/Room.js';
import { User } from './models/User.js';

dotenv.config();
const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: `${process.env.REACT_APP_URL}`,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware
app.use(cors(
    {
        origin: `${process.env.REACT_APP_URL}`,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
      }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoutes);

// Connect to MongoDB
connectDB();

// Store active rooms and their participants
const rooms = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Store the username with the socket for easy access
    let username = 'Anonymous'; // Default username
        
    // Fetch username from database based on authenticated user (if applicable)
    // This is a placeholder. You'll need to implement actual authentication
    // and associate a user ID with the socket. For now, we'll use a dummy.
    // In a real app, you'd get the user ID from a JWT or session.
    socket.on('set-username', async (userId) => {
        try {
            const user = await User.findById(userId);
            if (user) {
                username = user.username;
            socket.username = username;
                console.log(`User ${socket.id} set username to: ${username}`);
                socket.emit('username-response', username);
            }
        } catch (error) {
            console.error('Error setting username:', error);
        }
    });

    // Handle room joining
    socket.on('join-room', async (roomId) => {
        socket.join(roomId);
        
        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
        }
        rooms.get(roomId).add(socket.id);

        // Store message in the room
        let room = await Room.findOne({ roomId });
        if (!room) {
            room = new Room({ roomId, messages: [] });
            await room.save();
        }

        // Notify other participants in the room
        socket.to(roomId).emit('user-joined', { 
      userId: socket.id, 
      username: socket.username || 'Anonymous' 
    });
        
        // Send list of existing participants to the new user
        const participants = Array.from(rooms.get(roomId))
          .filter(id => id !== socket.id)
          .map(id => ({
            userId: id,
            username: io.sockets.sockets.get(id)?.username || 'Anonymous'
          }));
        socket.emit('existing-participants', participants);
    });

    // Handle chat messages
    socket.on('send-message', async (messageData) => {
        // Get user details from database
        const user = await User.findById(messageData.userId);
        const messageWithSender = {
            ...messageData,
            sender: user ? user.username : 'Anonymous',
            senderId: messageData.userId,
            timestamp: new Date().toISOString()
        };

        // Save message to database
        try {
            const room = await Room.findOne({ roomId: messageData.roomId });
            if (room) {
                room.messages.push(messageWithSender);
                await room.save();
            }
        } catch (error) {
            console.error('Error saving message:', error);
        }

        // Broadcast the message to all users in the room except the sender
        socket.to(messageData.roomId).emit('chat-message', messageWithSender);
    });

    // Handle request for room messages
    socket.on('get-room-messages', async (roomId) => {
        try {3
            const room = await Room.findOne({ roomId });
            if (room) {
                socket.emit('room-messages', room.messages);
            }
        } catch (error) {
            console.error('Error fetching room messages:', error);
        }
    });

    // Handle WebRTC signaling
    socket.on('offer', ({ offer, to }) => {
        socket.to(to).emit('offer', { offer, from: socket.id });
    });

    socket.on('answer', ({ answer, to }) => {
        socket.to(to).emit('answer', { answer, from: socket.id });
    });

    socket.on('ice-candidate', ({ candidate, to }) => {
        socket.to(to).emit('ice-candidate', { candidate, from: socket.id });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove user from all rooms
        rooms.forEach((participants, roomId) => {
            if (participants.has(socket.id)) {
                participants.delete(socket.id);
                io.to(roomId).emit('user-left', socket.id);
                if (participants.size === 0) {
                    rooms.delete(roomId);
                }
            }
        });
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle room creation
app.post('/create-room', async (req, res) => {
    try {
        const { roomId } = req.body;
        const newRoom = new Room({ roomId });
        await newRoom.save();
        res.status(201).json({ message: 'Room created successfully' });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Failed to create room' });
    }
});