const apiResponse = (statusCode, data, message) => {
  return {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  };
};

const successResponse = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export { apiResponse, successResponse, errorResponse };
