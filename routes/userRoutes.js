const express = require("express");
const multer = require("multer");

// Disk storage for files upload
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];

    const fileName = `user-${Date.now()}.${ext}`;

    cb(null, fileName);
  },
});
// Function to filer files upload
const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") return cb(null, true);
  else
    return cb(
      createResponse(statusMsg.FAIL, "Only images can be uploaded."),
      false
    );
};
const upload = multer({
  storage: diskStorage,
  fileFilter,
});

// The Controllers
const {
  // User Controller
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  updateUserImage,
} = require("../controllers/userController");

const {
  // Converstion Controller
  getUserConversations,
} = require("../controllers/conversationController");

const {
  // Notification Controller
  getUserNotifications,
  removeUserNotifications,
} = require("../controllers/notificationController");

// The Validations
const {
  registerUserValidation,
  loginUserValidation,
} = require("../validations/userValidation");

// The Lib
const { registerLimiter, loginLimiter } = require("../lib/rateLimit");

// The Middlewares
const verifyToken = require("../middlewares/verifyToken");

// The Utils
const createResponse = require("../utils/response");

const router = express.Router();

// Register Route
router.post(
  "/register",
  upload.single("profile_picture"),
  registerLimiter,
  registerUserValidation,
  registerUser
);

// Login Route
router.post("/login", loginLimiter, loginUserValidation, loginUser);

// Get a User Route
router.get("/:id", getUser);

// Get All User Route
router.get("/", getAllUsers);

// Update User Image
router.post("/:id/edit", upload.single("userImage"), updateUserImage);

// Get User Conversations Route
router.get("/:userId/conversations", getUserConversations);

// Get User Notificaions Route
router.get("/:userId/notifications", getUserNotifications);

// Delete User Notificaions Route
router.delete("/:userId/notifications", removeUserNotifications);

module.exports = router;
