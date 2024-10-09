const express = require("express");

// The Controllers
const { createMessage } = require("../controllers/messageController");
// Teh Validations
const createMessageValidation = require("../validations/messageValidation");

const router = express.Router();

// Route to create a new message
router.post("/", createMessageValidation, createMessage);

module.exports = router;
