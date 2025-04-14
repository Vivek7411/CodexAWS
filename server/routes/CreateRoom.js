const express = require("express");
const { v4: uuidV4 } = require("uuid");
const createRoomRoute = express.Router();
const verifyToken = require("../middleware/auth");
const Room = require("../model/Room");

createRoomRoute.post("/create-room", verifyToken, async (req, res) => {
  const roomId = uuidV4(); // no need for `await` on uuidV4
  const { userId, roomName } = req.body;

  try {
    const room = new Room({
      roomId: roomId,
      roomName: roomName,
      userId: userId, // creator of the room
      users: [
        {
          userId: userId,
          permission: "edit", // creator gets edit access
        },
      ],
    });

    console.log("USERID:", userId, "RoomName:", roomName);
    await room.save();

    res
      .status(200)
      .json({ message: "Room created successfully", roomId: room.roomId });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

module.exports = createRoomRoute;
