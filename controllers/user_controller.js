const catchAsync = require("../utils/catchAsync");
const httpStatusText = require("../utils/httpStatusText");
const userService = require("./../services/user_services");
const factor = require("./handlersFactory");

exports.updateMe = factor.UpdateOne(userService.updateMe);
exports.getMe = catchAsync(async (req, res, next) => {
  const email = req.user.email;
  const user = await userService.getUserByEmail(email);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    user,
  });
});
