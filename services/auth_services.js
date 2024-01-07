const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userModel = require("../models/user_model");
const buildReqBody = require("../utils/buildReqBody");
const AppError = require("../utils/appError");
const { sendEmail } = require("./../utils/email");
const { cache } = require("sharp");

const generateRandomCode = () =>
  Math.floor(Math.random() * 900000 + 100000).toString();

const hashResetCode = (resetCode) =>
  crypto.createHash("sha256").update(resetCode).digest("hex");

const correctPassword = async (plainPassword, encryptPassword) => {
  try {
    return await bcrypt.compare(plainPassword, encryptPassword);
  } catch (error) {
    throw error;
  }
};

exports.changePasswordAfterToken = async (user_id, issued_at) => {
  try {
    const user = await userModel.getUserAuth({ user_id });
    if (user.password_changed_at) {
      const changedTimestamp = parseInt(
        new Date(user.password_changed_at).getTime() / 1000,
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

exports.forgetPassword = async (email) => {
  try {
    // 1) Get user based on email
    if (!email) {
      throw new AppError(`Invalid email value`, 400);
    }
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new AppError(`This user is not found`, 404);
    }

    // 2) Generate random reset code
    const resetCode = generateRandomCode();
    const hashedResetCode = hashResetCode(resetCode);
    // 3) Save code code in database
    await userModel.updateUserAuth(user.user_id, {
      password_reset_code: hashedResetCode,
      password_reset_expires: Date.now() + 30 * 60 * 1000, // code will expire after 30 min
      password_reset_verified: false,
    });

    // 4) Send code to user email
    const options = {
      email,
      subject: "Reset Password",
      message: `Hi ${user.first_name} \n
    we received a request to reset the password on your E-Commerce account \n\n
    ${resetCode} \n\n
    Enter this code to complete the reset \n
    Note: this code valid for 30 min \n\n
    Thanks for helping us to keep account secure`,
    };

    try {
      await sendEmail(options);
    } catch (err) {
      await userModel.updateUserAuth(user.user_id, {
        password_reset_code: null,
        password_reset_expires: null,
        password_reset_verified: null,
      });
      throw new AppError(
        `There was an error sending the email. Try again later!`,
        500
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.verifyResetCode = async (code) => {
  const hashCode = hashResetCode(code);
  try {
    // 1) Find user based on the code
    const user = await userModel.getUserAuth({
      password_reset_code: hashCode,
      password_reset_expires: { ">": Date.now() },
      password_reset_verified: false,
    });
    if (!user) {
      throw new AppError("Reset code invalid or expired", 400);
    }

    // 2) If code has not expired, and there is user, reset code valid
    await userModel.updateUserAuth(user.user_id, {
      password_reset_code: null,
      password_reset_expires: null,
      password_reset_verified: true,
    });

    return user.user_id;
  } catch (error) {
    throw error;
  }
};

exports.resetPassword = async (user_id, password) => {
  try {
    // 1) Get user based on email and check if reset code is verified
    const user_auth = await userModel.getUserAuth({
      user_id,
      password_reset_verified: true,
    });
    if (!user_auth) {
      throw new AppError(`this user is not found`, 404);
    }
    // 2) Reset password
    const newPassword = await bcrypt.hash(password, 12);
    const newUser = await userModel.updateUserPassword(
      { user_id: user_auth.user_id },
      newPassword
    );

    delete newUser["password"];
    return newUser;
  } catch (error) {
    throw error;
  }
};

exports.changePassword = async (user_email, newPassword, curPassword) => {
  try {
    if (!newPassword || !curPassword) {
      throw new AppError(`Please enter valid value`, 400);
    }

    // 1) Get user from database
    const user = await userModel.findByEmail(user_email);
    if (!user) {
      throw new AppError(`this user is not found`, 404);
    }

    //  2) Check if POSTed current password is correct
    if (!(await correctPassword(curPassword, user.password))) {
      throw new AppError(`Your current password is wrong.`, 401);
    }

    // 3) Update password
    newPassword = await bcrypt.hash(newPassword, 12);
    const newUser = await userModel.updateUserPassword(
      {
        email: user_email,
      },
      newPassword
    );

    delete newUser["password"];
    return newUser;
  } catch (error) {
    throw error;
  }
};
