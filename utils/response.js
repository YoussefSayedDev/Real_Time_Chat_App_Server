const createResponse = (status, message, data = null) => ({
  status,
  message,
  data,
});

module.exports = createResponse;
