const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

// The Utils
const statusMsg = require("./utils/statusMsg");
const createResponse = require("./utils/response");

// The Routers
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Database Schmeas
const createUserSchema = require("./schemas/userSchema");
const {
  CreateConversationSechema,
  CreateConversationParticipantsSchema,
} = require("./schemas/conversationSchema");
const createMessageSchema = require("./schemas/messageSchema");
const createNotificationSchema = require("./schemas/notificationSchema");

app.use(express.json());
app.use(cors());

// Create The Schemas
createUserSchema();
CreateConversationSechema();
CreateConversationParticipantsSchema();
createMessageSchema();
createNotificationSchema();

// The MiddleWarre Routes
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.all("*", (req, res, next) => {
  res.status(404).json(createResponse(statusMsg.FAIL, "Route not found."));
});

/// Globel Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Run The Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
