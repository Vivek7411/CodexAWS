const express = require("express");
const dashboardRouter = express.Router();
const jwt = require("jsonwebtoken");

dashboardRouter.get("/dashboard", (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    return res.status(200).json({
      message: `Welcome to the dashboard`,
      userId: userId,
    });
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({
      message: "Invalid token, access denied.",
    });
  }
});

module.exports = dashboardRouter;
