const express = require("express");

const authController = require("./../controllers/auth_controller");
const { signupValidator } = require("./../validators/user_validators");

const router = express.Router();

router.post("/signup", signupValidator, authController.signup);

module.exports = router;
