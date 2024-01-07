const express = require("express");

const authController = require("./../controllers/auth_controller");
const {
  signupValidator,
  loginValidator,
  emailValidator,
} = require("./../validators/user_validators");

const router = express.Router();

router.post(
  "/signup",
  authController.uploadProfileImage,
  authController.resizeImage,
  signupValidator,
  authController.signup
);
router.post("/login", loginValidator, authController.login);
router.post("/forgetPassword", emailValidator, authController.forgetPassword);
router.post("/verifyResetCode", authController.verifyResetCode);
router.post("/resetPassword", authController.resetPassword);
module.exports = router;
