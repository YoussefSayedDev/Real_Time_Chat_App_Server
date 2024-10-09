const { body } = require("express-validator");

const registerUserValidation = [
  body("name").notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Invalid email format."),
  body("password").isStrongPassword().withMessage("Password must be strong."),
];

const loginUserValidation = [
  body("email").isEmail().withMessage("Invalid email format."),
  body("password").notEmpty().withMessage("Password is required."),
];

module.exports = { registerUserValidation, loginUserValidation };
