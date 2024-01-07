const express = require("express");

const authController = require("./../controllers/auth_controller");
const userController = require("./../controllers/user_controller");
const {
  signupValidator,
  loginValidator,
  emailValidator,
  changePasswordValidator,
  updateUserValidator,
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

router
  .route("/me")
  .patch(
    protect,
    authController.uploadProfileImage,
    authController.resizeImage,
    updateUserValidator,
    userController.updateMe
  )
  .get(protect, userController.getMe);

module.exports = router;
