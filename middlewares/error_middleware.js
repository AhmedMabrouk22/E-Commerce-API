const httpStatusText = require("../utils/httpStatusText");
const AppError = require("./../utils/appError");

const handleDuplicateDBError = (err) => {
  const value = err.detail.match(/\(([^)]+)\)/g)[1];
  const message = `Duplicate field value ${value}, Please use another value`;
  return new AppError(message, 400);
};

const handleColumnDBError = (err) => {
  value = err.message.match(/"([^"]+)"/)[1];
  const message = `Field ${value} not exist`;
  return new AppError(message, 400);
};

const sendToDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendToProd = (err, res) => {
  // Operational, trusted error : send error to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't send error details to client
  } else {
    // 1) Log error
    console.error("ERROR 💥️:", err);

    // Send message to client
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || httpStatusText.ERROR;

  if (process.env.NODE_ENV === "development") {
    sendToDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    if (error.code === "23505") error = handleDuplicateDBError(error);
    if (error.code === "42703") error = handleColumnDBError(error);
    sendToProd(error, res);
  }
};
