const couponServices = require("./../services/coupon_services");
const factor = require("./handlersFactory");

// @desc    Add coupon
// @route   POST /api/v1/coupons
// @access  Protected/Admin-Manager
exports.addCoupon = factor.createOne(couponServices.createCoupon);

// @desc    Get coupons
// @route   GET /api/v1/coupons
// @access  Protected/Admin-Manager
exports.getCoupons = factor.get(couponServices.getAllCoupons);

// @desc    Get coupon
// @route   GET /api/v1/coupons/:code
// @access  Protected/Admin-Manager
exports.getCoupon = factor.getOne(couponServices.getCouponById);

// @desc    Update coupon
// @route   PATCH /api/v1/coupons/:code
// @access  Protected/Admin-Manager
exports.updateCoupon = factor.UpdateOne(couponServices.updateCoupon);

// @desc    Delete coupon
// @route   DELETE /api/v1/coupons/:code
// @access  Protected/Admin-Manager
exports.deleteCoupon = factor.deleteOne(couponServices.deleteCouponById);
