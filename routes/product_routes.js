const express = require("express");

const productController = require("./../controllers/product_controller");
const {
  createProductValidator,
  IDProductValidator,
  updateProductValidator,
} = require("./../validators/product_validators");

const router = express.Router();
router
  .route("/")
  .post(createProductValidator, productController.createProduct)
  .get(productController.getAllProducts);

router
  .route("/:id")
  .get(IDProductValidator, productController.getAllProduct)
  .delete(IDProductValidator, productController.deleteProduct)
  .patch(
    IDProductValidator,
    updateProductValidator,
    productController.updateProduct
  );

module.exports = router;
