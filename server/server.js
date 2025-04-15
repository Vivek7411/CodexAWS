//YOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO WE ARE BACK BABY
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const connectDB = require("./db/dbconnect");
const dotenv = require("dotenv");
const cookie = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");

// Routers
const SignUpRouter = require("./routes/Signup");
const loginRouter = require("./routes/Login");
const dashboardRouter = require("./routes/Dashboard");
const createRoomRoute = require("./routes/CreateRoom");
const saveCodeRoute = require("./routes/SaveCodeRoute");
const fetchRoomsRoute = require("./routes/FetchRoomsRoute");
const Room = require("./model/Room");
const { default: mongoose } = require("mongoose");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3100;

// Middleware
app.use(cors());
app.use(cookie());
app.use(bodyparser.json());
app.use(express.json());

// Routes
app.use("/", SignUpRouter);
app.use("/", loginRouter);
app.use("/", dashboardRouter);
app.use("/", createRoomRoute);
app.use("/", saveCodeRoute);
app.use("/", fetchRoomsRoute);

// Socket maps
const userSocketMap = {};
const socketUserMap = {};

// Helper to get all connected clients in a room
const getAllConnectedClients = (roomId) => {
  const socketIds = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
  return socketIds.map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
    userId: socketUserMap[socketId],
  }));
};

// Socket logic
io.on("connection", (socket) => {
  console.log(`🔌 New socket connected: ${socket.id}`);

  socket.on(ACTIONS.JOIN, async ({ roomId, username, userId }) => {
    try {
      userSocketMap[socket.id] = username;
      socketUserMap[socket.id] = userId;
      socket.join(roomId);

      let room = await Room.findOne({ roomId });
      let userPermission = "read";

      if (!room) {
        // First user - make them the owner
        room = new Room({
          roomId,
          roomName: "Untitled Room",
          userId,
          users: [
            {
              userId: new mongoose.Types.ObjectId(userId),
              permission: "owner",
            },
          ],
        });
        userPermission = "owner";
        await room.save();
        console.log(`✅ Room ${roomId} created with user ${userId} as owner`);
      } else {
        const existingUser = room.users.find(
          (u) => u.userId.toString() === userId
        );

        if (!existingUser) {
          room.users.push({
            userId: new mongoose.Types.ObjectId(userId),
            permission: "read",
          });
          await room.save();
          console.log(`👤 User ${userId} joined room ${roomId} as read`);
        } else {
          userPermission = existingUser.permission;
          console.log(
            `🔁 User ${userId} already in room with ${userPermission} access`
          );
        }
      }

      const rawClients = getAllConnectedClients(roomId);
      const enrichedClients = rawClients.map(
        ({ socketId, username, userId }) => {
          const userData = room.users.find(
            (u) => u.userId.toString() === userId
          );
          return {
            socketId,
            username,
            userId,
            permission: userData?.permission || "read",
          };
        }
      );

      enrichedClients.forEach((client) => {
        io.to(client.socketId).emit(ACTIONS.JOINED, {
          clients: enrichedClients,
          username,
          socketId: socket.id,
          ...(client.socketId === socket.id && {
            permission: client.permission,
          }),
        });
      });
    } catch (err) {
      console.error("🔥 Error in JOIN:", err);
    }
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SAVE_CODE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.SAVE_CODE, { code });
  });

  socket.on(
    ACTIONS.CHANGE_PERMISSION,
    async ({ roomId, targetSocketId, newPermission }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;

        const initiatorUserId = socketUserMap[socket.id];
        const initiatorUser = room.users.find(
          (u) => u.userId.toString() === initiatorUserId
        );

        if (initiatorUser?.permission !== "owner") return; // Only owner can change permissions

        const targetUserId = socketUserMap[targetSocketId];
        const targetUser = room.users.find(
          (u) => u.userId.toString() === targetUserId
        );

        if (!targetUser || targetUser.permission === "owner") return; // Cannot change owner

        targetUser.permission = newPermission;
        await room.save();

        const updatedClients = getAllConnectedClients(roomId).map((client) => {
          const userId = socketUserMap[client.socketId];
          const user = room.users.find((u) => u.userId.toString() === userId);
          return {
            ...client,
            permission: user?.permission || "read",
          };
        });

        updatedClients.forEach(({ socketId }) => {
          io.to(socketId).emit(ACTIONS.UPDATE_PERMISSION, {
            clients: updatedClients,
          });
        });

        console.log(
          `🔁 Permission updated: ${targetUserId} → ${newPermission}`
        );
      } catch (err) {
        console.error("🔥 Error in CHANGE_PERMISSION:", err);
      }
    }
  );

  socket.on("disconnecting", async () => {
    const rooms = [...socket.rooms].filter((roomId) => roomId !== socket.id);
    for (const roomId of rooms) {
      const username = userSocketMap[socket.id];
      const userId = socketUserMap[socket.id];
      let permission = "read";

      const room = await Room.findOne({ roomId });
      if (room) {
        const user = room.users.find((u) => u.userId.toString() === userId);
        permission = user?.permission || "read";
      }

      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username,
        userId,
        permission,
      });
    }

    delete userSocketMap[socket.id];
    delete socketUserMap[socket.id];
  });
});

// Start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err);
  });
