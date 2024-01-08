const express = require("express");

const authController = require("./../controllers/auth_controller");
const userController = require("./../controllers/user_controller");
const {
  signupValidator,
  loginValidator,
  emailValidator,
  changePasswordValidator,
  updateUserValidator,
  userIdValidators,
  changeRoleValidator,
  createUserValidator,
} = require("./../validators/user_validators");
const { protect, restrictTo } = require("./../middlewares/auth_middleware");
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

router
  .route("/")
  .post(
    protect,
    restrictTo("admin"),
    createUserValidator,
    userController.createUser
  )
  .get(protect, restrictTo("admin"), userController.getAllUsers);
router
  .route("/:id")
  .get(protect, restrictTo("admin"), userIdValidators, userController.getUser)
  .patch(
    protect,
    restrictTo("admin"),
    changeRoleValidator,
    userController.updateUser
  )
  .delete(
    protect,
    restrictTo("admin"),
    userIdValidators,
    userController.deleteUser
  );

module.exports = router;
