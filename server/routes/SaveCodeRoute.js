const express = require('express');
const saveCodeRoute = express.Router();
const Room = require('../model/Room');
const verifyToken = require('../middleware/auth'); // Ensure auth middleware is imported

saveCodeRoute.post('/save-code', verifyToken, async (req, res) => {
    const { roomId, code, roomName } = req.body;
    const userId = req.user.id; // Retrieved from the verified token

    try {
        const room = await Room.create({ roomId, hostId: userId, roomName });
        console.log(room)

        if (!room) {
            return res.status(404).json({ error: "No valid room found or user unauthorized" });
        }

        room.code = code;
        await room.save();
        res.status(200).json({ message: "Code saved successfully!" }); // Success response
    } catch (error) {
        console.error("Error saving code:", error);
        res.status(500).json({ error: "Error in saving code" });
    }
    
});

module.exports = saveCodeRoute;