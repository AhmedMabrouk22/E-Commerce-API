const catchAsync = require("../utils/catchAsync");
const httpStatusText = require("../utils/httpStatusText");
const userService = require("./../services/user_services");
const authService = require("./../services/auth_services");
const factor = require("./handlersFactory");

// @desc    Update me (logged user)
// @route   PATCH /api/v1/users/me
// @access  Protected/User
exports.updateMe = factor.UpdateOne(userService.updateUser);

// @desc    Get me (logged user)
// @route   GET /api/v1/users/me
// @access  Protected/User
exports.getMe = catchAsync(async (req, res, next) => {
  const email = req.user.email;
  const user = await userService.getUserByEmail(email);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    user,
  });
});

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Protected/Admin
exports.getAllUsers = factor.get(userService.getAllUsers);

// @desc    Get user
// @route   GET /api/v1/users/:id
// @access  Protected/Admin
exports.getUser = factor.getOne(userService.getUser);

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Protected/Admin
exports.createUser = factor.createOne(authService.signup);

// @desc    Update specific user
// @route   PATCH /api/v1/users/:id
// @access  Protected/Admin
exports.updateUser = factor.UpdateOne(userService.updateUser);

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Protected/Admin
exports.deleteUser = factor.deleteOne(userService.deleteUser);
