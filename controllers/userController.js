const User = require("../models/userModel");
const createResponse = require("../utils/response");
const createUserResponse = require("../utils/userResponse");
const statusMsg = require("../utils/statusMsg");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const url = `${process.env.DOMAIN}:${process.env.PORT}/api/uploads`;

// Register a new User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Set profile_picture with sending image if exist
  let profile_picture = `${url}/${req?.file?.filename}`;

  // Set profile_picture withe defualt image if does not exist
  if (!req?.file?.filename) profile_picture = `${url}/profile.png`;

  // Validation of request
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json(createResponse(statusMsg.FAIL, errors.array()));

  try {
    const existingUser = await User.findUserByEmail(email);

    if (existingUser)
      return res
        .status(400)
        .json(
          createResponse(statusMsg.FAIL, [
            { msg: "User with the given email already exists." },
          ])
        );

    const newUser = await User.createUser(
      name,
      email,
      password,
      profile_picture
    );

    const token = await User.generateToken(newUser);

    res
      .status(201)
      .json(
        createResponse(
          statusMsg.SUCCESS,
          "User registered successfully.",
          createUserResponse(newUser, token)
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server error: ${error.message}`
        )
      );
  }
};

// Login a User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json(createResponse(statusMsg.FAIL, errors.array()));

  try {
    const user = await User.findUserByEmail(email);
    if (!user)
      return res
        .status(400)
        .json(
          createResponse(statusMsg.FAIL, [
            { msg: "Invalid email or password." },
          ])
        );

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword)
      return res
        .status(400)
        .json(
          createResponse(statusMsg.FAIL, [
            { msg: "Invalid email or password." },
          ])
        );

    const token = await User.generateToken(user);

    res
      .status(200)
      .json(
        createResponse(
          statusMsg.SUCCESS,
          "User logged in successfully.",
          createUserResponse(user, token)
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server controller error: ${error.message}`
        )
      );
  }
};

// Get a User
const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findUserById(id);

    if (!user)
      return res
        .status(404)
        .json(createResponse(statusMsg.FAIL, "User not found."));

    res
      .status(200)
      .json(
        createResponse(statusMsg.SUCCESS, "User found successfully.", user)
      );
  } catch (error) {
    res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server error: ${error.message}`
        )
      );
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAllUsers();
    res.status(200).json(
      createResponse(statusMsg.SUCCESS, "Users found successfully.", {
        users,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server error: ${error.message}`
        )
      );
  }
};

const updateUserImage = async (req, res) => {
  const { id } = req.params;

  if (!req.file)
    return res
      .status(400)
      .json(createResponse(statusMsg.FAIL, "Image did not recive."));

  let profile_picture = `${url}/${req?.file?.filename}`;

  try {
    const existingUser = await User.findUserById(id);

    if (!existingUser)
      return res
        .status(404)
        .json(createResponse(statusMsg.FAIL, "User not found."));

    const updateUser = await User.updateImage(profile_picture, id);

    const token = await User.generateToken(updateUser);

    res
      .status(200)
      .json(
        createResponse(
          statusMsg.SUCCESS,
          "User image updating successfully.",
          createUserResponse(updateUser, token)
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server error: ${error.message}`
        )
      );
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  updateUserImage,
};
