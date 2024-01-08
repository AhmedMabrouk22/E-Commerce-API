const express = require("express");

const wishlistController = require("./../controllers/wishlist_controller");
const {
  addProductToWishlistValidator,
  productIdValidator,
} = require("./../validators/wishlist_validators");

const { protect, restrictTo } = require("./../middlewares/auth_middleware");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictTo("user"),
    addProductToWishlistValidator,
    wishlistController.add
  )
  .get(protect, restrictTo("user"), wishlistController.get);
router
  .route("/:productId")
  .delete(
    protect,
    restrictTo("user"),
    productIdValidator,
    wishlistController.delete
  );

module.exports = router;
