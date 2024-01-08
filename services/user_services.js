const AppError = require("../utils/appError");
const userModel = require("./../models/user_model");
const buildReqBody = require("./../utils/buildReqBody");
const fileHandler = require("./../utils/file");
const ApiFeatures = require("./../utils/apiFeatures");

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

exports.updateUser = async (req) => {
  try {
    const userReq = buildReqBody(req.body);

    let user_image;
    if (userReq.profile_image) {
      const curUser = await userModel.findByEmail(req.user.email);
      user_image = curUser.profile_image;
    }

    user_id = req.params.id || req.user.user_id;
    let user = await userModel.updateUser({ user_id }, userReq);

    if (!user) {
      fileHandler.deleteFile(userReq.profile_image);
    }

    if (user_image) {
      fileHandler.deleteFile(user_image);
    }
    if (user) delete user["password"];
    return user;
  } catch (error) {
    throw error;
  }
};

exports.getAllUsers = async (req) => {
  try {
    const stringQuery = req.query;
    const api = new ApiFeatures(stringQuery, {})
      .filter()
      .limitFields()
      .paginate()
      .sort()
      .getApiConfig();
    let users = await userModel.find(api);

    users.map((elm) => delete elm["password"]);
    return users;
  } catch (error) {
    throw error;
  }
};

exports.getUser = async (req) => {
  try {
    const user_id = req.params.id;
    let user = await userModel.findByID(user_id);
    if (user) delete user["password"];
    return user;
  } catch (error) {
    throw error;
  }
};

exports.createUser = async (req) => {
  try {
    let userReq = buildReqBody(req.body);
    let user = await userModel.signup(userReq);
    if (user) delete user["password"];
    return user;
  } catch (error) {
    throw error;
  }
};

exports.deleteUser = async (req) => {
  try {
    const user_id = req.params.id;
    const user = await userModel.deleteById(user_id);
    if (user) {
      fileHandler.deleteFile(user["profile_image"]);
    }
    return user;
  } catch (error) {
    throw error;
  }
};
