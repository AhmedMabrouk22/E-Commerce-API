const wishlistServices = require("./../services/wishlist_services");
const factor = require("./handlersFactory");

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Protected/User
exports.add = factor.createOne(wishlistServices.addProductToWishlist);

// @desc    Get wishlist
// @route   GET /api/v1/wishlist
// @access  Protected/User
exports.get = factor.get(wishlistServices.getWishlist);

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Protected/User
exports.delete = factor.deleteOne(wishlistServices.deleteProductFromWishlist);
