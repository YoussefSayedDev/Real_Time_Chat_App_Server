const createResponse = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error(err); // Log error details
  res
    .status(500)
    .json(createResponse(500, "Internal server error.", err.message));
};

module.exports = errorHandler;
