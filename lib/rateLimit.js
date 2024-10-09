const rateLimit = require("express-rate-limit");

// Set up rate limiter of ten requests per minute
const registerLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 request per windowMs
  message: "Too many registrations from this IP, please try again later.",
});

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many login attempts from this IP, please try again later.",
});

module.exports = {
  registerLimiter,
  loginLimiter,
};
