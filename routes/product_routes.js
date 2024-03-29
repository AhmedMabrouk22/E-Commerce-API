const express = require("express");

const productController = require("./../controllers/product_controller");
const {
  createProductValidator,
  IDProductValidator,
  updateProductValidator,
} = require("./../validators/product_validators");
const reviewsRoute = require("./review_routes");
const { protect, restrictTo } = require("./../middlewares/auth_middleware");

const router = express.Router();

router.use("/:productId/reviews", reviewsRoute);
router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    productController.uploadProductImages,
    productController.resizeImage,
    createProductValidator,
    productController.createProduct
  )
  .get(productController.getAllProducts);

router
  .route("/:id")
  .get(IDProductValidator, productController.getAllProduct)
  .delete(
    protect,
    restrictTo("admin", "manager"),
    IDProductValidator,
    productController.deleteProduct
  )
  .patch(
    protect,
    restrictTo("admin", "manager"),
    IDProductValidator,
    productController.uploadProductImages,
    productController.resizeImage,
    updateProductValidator,
    productController.updateProduct
  );

module.exports = router;
