const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const AppError = require("../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const userServices = require("./../services/user_services");
const authServices = require("./../services/auth_services");

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(`You are not logged in! Please log in to get access.`, 401)
    );
  }
  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check user
  let currentUser = await userServices.getUserByEmail(decoded.email);

  // 4) Check if user changed password after the token was created
  if (await authServices.changePasswordAfterToken(decoded.id, decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  delete currentUser["password"];
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role_name)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
