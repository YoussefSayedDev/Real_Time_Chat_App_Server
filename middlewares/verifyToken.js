const jwt = require("jsonwebtoken");
const createResponse = require("../utils/response");
const statusMsg = require("../utils/statusMsg");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader)
    return res
      .status(401)
      .json(createResponse(statusMsg.FAIL, "Forbidden token is required."));

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server error: ${error.message}`
        )
      );
  }
};

module.exports = verifyToken;
