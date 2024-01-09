const express = require("express");

const orderController = require("./../controllers/order_controller");
const { protect, restrictTo } = require("./../middlewares/auth_middleware");
const {
  orderIdValidator,
  updateOrderStatusValidator,
  createOrderValidator,
} = require("./../validators/orders_validators");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictTo("user"),
    createOrderValidator,
    orderController.createOrder
  )
  .get(
    protect,
    restrictTo("user", "admin", "manager"),
    orderController.getOrders
  );

router.get("/success", orderController.orderSuccess);
router.get("/cancel", orderController.orderCancel);

router
  .route("/:id")
  .get(
    protect,
    restrictTo("user", "manager", "admin"),
    orderIdValidator,
    orderController.getOrder
  )
  .patch(
    protect,
    restrictTo("admin", "manager"),
    updateOrderStatusValidator,
    orderController.changeOrderStatus
  );

module.exports = router;
