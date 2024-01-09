const catchAsync = require("../utils/catchAsync");
const httpStatusText = require("../utils/httpStatusText");
const cartServices = require("./../services/shoppingCart_services");
const factor = require("./handlersFactory");

// @desc    Add product to cart
// @route   POST /api/v1/shoppingCart
// @access  Protected/User
exports.addItem = factor.createOne(cartServices.add);

// @desc    Add cart
// @route   Get /api/v1/shoppingCart
// @access  Protected/User
exports.getCart = factor.getOne(cartServices.getShoppingCart);

// @desc    Delete Product from cart
// @route   DELETE /api/v1/shoppingCart/:productId
// @access  Protected/User
exports.deleteItem = factor.deleteOne(cartServices.deleteProduct);

// @desc    Clear cart
// @route   DELETE /api/v1/shoppingCart/
// @access  Protected/User
exports.clearCart = factor.deleteOne(cartServices.clearCart);

// @desc    Apply Coupon
// @route   POST /api/v1/shoppingCart/applyCoupon
// @access  Protected/User
exports.applyCoupon = catchAsync(async (req, res, next) => {
  const price = await cartServices.applyCoupon(req);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    price,
  });
});
