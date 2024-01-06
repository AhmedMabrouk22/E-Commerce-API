const authServices = require("./../services/auth_services");
const catchAsync = require("./../utils/catchAsync");
const httpStatus = require("./../utils/httpStatusText");

const createToken = (user, statusCode, res) => {
  const token = authServices.signToken(user.email);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: httpStatus.SUCCESS,
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await authServices.signup(req);
  createToken(user, 201, res);
});
