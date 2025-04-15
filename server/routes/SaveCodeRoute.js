const express = require("express");
const saveCodeRoute = express.Router();
const Room = require("../model/Room");
const verifyToken = require("../middleware/auth");

// Save or update code
saveCodeRoute.post("/save-code", verifyToken, async (req, res) => {
  const { roomId, code } = req.body;

  if (!roomId || !code) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const userId = req.user.id.toString();
    const isHost = room.userId.toString() === userId;

    const hasEditPermission = room.users?.some((user) => {
      return user.userId.toString() === userId && user.permission === "edit";
    });

    if (!isHost && !hasEditPermission) {
      return res
        .status(403)
        .json({ message: "You do not have permission to save this code." });
    }

    room.code = code;
    await room.save();

    res.status(200).json({ message: "Code saved successfully!" });
  } catch (error) {
    console.error("Error saving code:", error);
    res.status(500).json({ error: "Error in saving code" });
  }
});

// Get code (read-only, allowed for all in the room)
saveCodeRoute.get("/get-code/:roomId", verifyToken, async (req, res) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ error: "No valid room found" });
    }

    res.status(200).json({ code: room.code });
  } catch (error) {
    console.error("Error getting code:", error);
    res.status(500).json({ error: "Error in getting code" });
  }
});

module.exports = saveCodeRoute;
