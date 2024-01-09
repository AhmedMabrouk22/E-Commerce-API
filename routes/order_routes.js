const express = require("express");

const orderController = require("./../controllers/order_controller");
const { protect, restrictTo } = require("./../middlewares/auth_middleware");

const router = express.Router();

router
  .route("/")
  .post(protect, restrictTo("user"), orderController.createOrder)
  .get(
    protect,
    restrictTo("user", "admin", "manager"),
    orderController.getOrders
  );

router
  .route("/:id")
  .get(
    protect,
    restrictTo("user", "manager", "admin"),
    orderController.getOrder
  )
  .patch(
    protect,
    restrictTo("admin", "manager"),
    orderController.changeOrderStatus
  );

module.exports = router;
