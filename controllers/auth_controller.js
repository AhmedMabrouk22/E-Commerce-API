const sharp = require("sharp");

const authServices = require("./../services/auth_services");
const catchAsync = require("./../utils/catchAsync");
const httpStatus = require("./../utils/httpStatusText");
const {
  uploadSingleImage,
} = require("./../middlewares/uploadImage_middleware");
const pathHandler = require("./../utils/paths");

const createToken = (user, statusCode, res) => {
  const token = authServices.signToken(user.email, user.user_id);
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

exports.uploadProfileImage = uploadSingleImage("profile_image");
exports.resizeImage = async (req, res, next) => {
  if (req.file) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `User-${uniqueSuffix}.jpeg`;
    const filepath = pathHandler.generatePath(filename);
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`./${filepath}`);

    req.body.profile_image = filename;
    req.file.fileName = filename;
  }
  next();
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await authServices.signup(req);
  createToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authServices.login(email, password);
  createToken(user, 200, res);
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  await authServices.forgetPassword(email);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "reset code send to email",
  });
});

exports.verifyResetCode = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  const user_id = await authServices.verifyResetCode(code);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: {
      user_id: user_id,
      message: "Reset code valid",
    },
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { user_id, password } = req.body;
  const user = await authServices.resetPassword(user_id, password);
  createToken(user, 200, res);
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { current_password, new_password } = req.body;
  const user = await authServices.changePassword(
    req.user.email,
    new_password,
    current_password
  );
  createToken(user, 200, res);
});
