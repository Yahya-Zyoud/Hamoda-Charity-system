const { HTTP_STATUS, MESSAGES } = require("../config/constants");

const makeSuccessResponse = (data, message = MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK) => {
  return {
    success: true,
    message,
    data,
  };
};

const makeErrorResponse = (message = MESSAGES.ERROR, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
  return {
    success: false,
    message,
    statusCode,
  };
};

const formatResponse = (request, response, next) => {
  response.sendSuccess = (data, message, statusCode = HTTP_STATUS.OK) => {
    return response.status(statusCode).json(makeSuccessResponse(data, message, statusCode));
  };

  response.sendError = (message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
    return response.status(statusCode).json(makeErrorResponse(message, statusCode));
  };

  next();
};

module.exports = {
  responseFormatter: formatResponse,
  successResponse: makeSuccessResponse,
  errorResponse: makeErrorResponse,
};
