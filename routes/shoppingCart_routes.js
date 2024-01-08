const express = require("express");

const cartController = require("./../controllers/shoppingCart_controller");
const { protect, restrictTo } = require("./../middlewares/auth_middleware");

const router = express.Router();

router
  .route("/")
  .post(protect, restrictTo("user"), cartController.addItem)
  .get(protect, restrictTo("user"), cartController.getCart)
  .delete(protect, restrictTo("user"), cartController.clearCart);

router
  .route("/applyCoupon")
  .post(protect, restrictTo("user"), cartController.applyCoupon);

router
  .route("/:productId")
  .delete(protect, restrictTo("user"), cartController.deleteItem);

module.exports = router;
