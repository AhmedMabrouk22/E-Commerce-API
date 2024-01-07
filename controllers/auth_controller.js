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
