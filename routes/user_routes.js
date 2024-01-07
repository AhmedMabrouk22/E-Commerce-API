const express = require("express");

const authController = require("./../controllers/auth_controller");
const {
  signupValidator,
  loginValidator,
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

module.exports = router;
