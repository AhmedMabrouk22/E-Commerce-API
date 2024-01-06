const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user_model");
const buildReqBody = require("../utils/buildReqBody");
const AppError = require("../utils/appError");

exports.signToken = (email) =>
  jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = async (req) => {
  try {
    // 1) get user request body
    const userReq = buildReqBody(req.body);

    // 2) Check if this email is exist
    const isExist = await userModel.findByEmail(userReq.email);
    if (isExist) {
      throw new AppError(`This email is already exist`, 400);
    }
    // 3) Hash password
    userReq.password = await bcrypt.hash(userReq.password, 12);

    // 4) Save user
    const result = await userModel.signup(userReq);

    return result;
  } catch (error) {
    throw error;
  }
};
