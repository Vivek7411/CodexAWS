const express = require('express');
const Room = require('../model/Room');
const verifyToken = require('../middleware/auth');

const fetchRoomsRoute = express.Router();

// API to fetch all saved room IDs
fetchRoomsRoute.get('/user/:userId/rooms', verifyToken, async (req, res) => {
    const { userId } = req.params;
    const { sortBy = 'createdAt', order = 'desc' } = req.query;

    try {
        const rooms = await Room.find({ userId }).sort({ [sortBy]: order === 'asc' ? 1 : -1 });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch saved code' });
    }
});

module.exports = fetchRoomsRoute;
