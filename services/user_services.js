const AppError = require("../utils/appError");
const userModel = require("./../models/user_model");
const buildReqBody = require("./../utils/buildReqBody");
const fileHandler = require("./../utils/file");

exports.getUserByEmail = async (email) => {
  try {
    if (!email) {
      throw new AppError(`Invalid email`, 400);
    }
    let user = await userModel.findByEmail(email);
    if (!user) {
      throw new AppError(
        `The user belonging to this token does no longer exist.`,
        401
      );
    }
    delete user["password"];
    return user;
  } catch (error) {
    throw error;
  }
};

exports.updateMe = async (req) => {
  try {
    const userReq = buildReqBody(req.body);

    let user_image;
    if (userReq.profile_image) {
      const curUser = await userModel.findByEmail(req.user.email);
      user_image = curUser.profile_image;
    }

    const user = await userModel.updateUser(
      { user_id: req.user.user_id },
      userReq
    );

    if (!user) {
      fileHandler.deleteFile(userReq.profile_image);
    }

    if (user_image) {
      fileHandler.deleteFile(user_image);
    }

    return user;
  } catch (error) {
    throw error;
  }
};
