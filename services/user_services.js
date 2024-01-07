const AppError = require("../utils/appError");
const userModel = require("./../models/user_model");

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
