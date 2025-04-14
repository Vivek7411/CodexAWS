const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rooms: [
    // 👇 Optional: track rooms the user is part of
    {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
      permission: {
        type: String,
        enum: ["read", "edit"],
        default: "read",
      },
    },
  ],
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
