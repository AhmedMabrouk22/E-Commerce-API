const express = require("express");

const couponController = require("./../controllers/coupon_controller");
const {
  couponIdValidator,
  createCouponValidator,
  updateCouponValidator,
} = require("./../validators/coupon_validator");
const { protect, restrictTo } = require("./../middlewares/auth_middleware");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    createCouponValidator,
    couponController.addCoupon
  )
  .get(protect, restrictTo("admin", "manager"), couponController.getCoupons);

router
  .route("/:code")
  .get(
    protect,
    restrictTo("admin", "manager"),
    couponIdValidator,
    couponController.getCoupon
  )
  .patch(
    protect,
    restrictTo("admin", "manager"),
    updateCouponValidator,
    couponController.updateCoupon
  )
  .delete(
    protect,
    restrictTo("admin", "manager"),
    couponIdValidator,
    couponController.deleteCoupon
  );

module.exports = router;
