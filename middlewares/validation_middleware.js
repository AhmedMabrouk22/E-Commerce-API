const { validationResult } = require("express-validator");

const AppError = require("./../utils/appError");

module.exports = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new AppError(error.array()[0].msg, 400));
  }
  next();
};
