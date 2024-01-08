const AppError = require("../utils/appError");
const wishlistModel = require("./../models/wishlist_model");
const ApiFeatures = require("./../utils/apiFeatures");
const buildReqBody = require("./../utils/buildReqBody");

exports.addProductToWishlist = async (req) => {
  try {
    req.body.user_id = req.user.user_id;
    const wishlistReq = buildReqBody(req.body);
    const wishlist = await wishlistModel.add(wishlistReq);
    return wishlist;
  } catch (error) {
    throw error;
  }
};

exports.getWishlist = async (req) => {
  try {
    const wishlist = await wishlistModel.get(req.user.user_id);
    return wishlist;
  } catch (error) {
    throw error;
  }
};

exports.deleteProductFromWishlist = async (req) => {
  try {
    const product_id = req.params.productId;
    const user_id = req.user.user_id;
    const wishlist = await wishlistModel.delete(user_id, product_id);
    return wishlist;
  } catch (error) {
    throw error;
  }
};
