const catchAsync = require("../utils/catchAsync");
const httpStatusText = require("../utils/httpStatusText");
const cartServices = require("./../services/shoppingCart_services");
const factor = require("./handlersFactory");

exports.addItem = factor.createOne(cartServices.add);
exports.getCart = factor.getOne(cartServices.getShoppingCart);
exports.deleteItem = factor.deleteOne(cartServices.deleteProduct);
exports.clearCart = factor.deleteOne(cartServices.clearCart);
exports.applyCoupon = catchAsync(async (req, res, next) => {
  const price = await cartServices.applyCoupon(req);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    price,
  });
});
