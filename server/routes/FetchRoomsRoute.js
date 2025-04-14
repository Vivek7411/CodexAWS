const express = require("express");
const Room = require("../model/Room");
const verifyToken = require("../middleware/auth");

const fetchRoomsRoute = express.Router();

// API to fetch all rooms accessible by the user (host or invited user)
fetchRoomsRoute.get("/user/:userId/rooms", verifyToken, async (req, res) => {
  const { userId } = req.params;
  const { sortBy = "createdAt", order = "desc" } = req.query;

  try {
    const rooms = await Room.find({
      $or: [{ hostId: userId }, { "users.userId": userId }],
    }).sort({ [sortBy]: order === "asc" ? 1 : -1 });

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch saved rooms" });
  }
});

module.exports = fetchRoomsRoute;
