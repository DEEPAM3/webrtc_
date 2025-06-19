import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    participants: [{
        socketId: String,
        joinedAt: Date
    }],
    messages: [{
        sender: String,
        text: String,
        timestamp: String
    }]
});

export const Room = mongoose.model('Room', roomSchema);