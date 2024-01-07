const express = require("express");

const authController = require("./../controllers/auth_controller");
const {
  signupValidator,
  loginValidator,
  emailValidator,
  changePasswordValidator,
} = require("./../validators/user_validators");
const { protect } = require("./../middlewares/auth_middleware");
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
router.post(
  "/me/changePassword",
  changePasswordValidator,
  protect,
  authController.changePassword
);
module.exports = router;
