const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user_model");
const buildReqBody = require("../utils/buildReqBody");
const AppError = require("../utils/appError");

const correctPassword = async (plainPassword, encryptPassword) => {
  try {
    return await bcrypt.compare(plainPassword, encryptPassword);
  } catch (error) {
    throw error;
  }
};

exports.changePasswordAfterToken = async (user_id, issued_at) => {
  try {
    const user = await userModel.getUserAuth(user_id);
    if (user.password_changed_at) {
      console.log("it not null");
      const changedTimestamp = parseInt(
        user.password_changed_at.getTime() / 1000,
        10
      );

      return issued_at < changedTimestamp;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

exports.signToken = (email, id) =>
  jwt.sign({ email, id }, process.env.JWT_SECRET, {
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

exports.login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new AppError(`Please provide email and password`, 400);
    }

    // 1) Check if user is exist and email is correct
    let user = await userModel.findByEmail(email);
    if (!user || !(await correctPassword(password, user.password))) {
      throw new AppError(`Invalid email or password`, 404);
    }
    // 2) return user
    delete user["password"];
    return user;
  } catch (error) {
    throw error;
  }
};
