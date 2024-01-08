const express = require("express");

const brandController = require("./../controllers/brand_controllers");
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
} = require("./../validators/brand_validation");
const { protect, restrictTo } = require("./../middlewares/auth_middleware");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    createBrandValidator,
    brandController.createBrand
  )
  .get(brandController.getBrands);

router
  .route("/:id")
  .get(getBrandValidator, brandController.getBrand)
  .patch(
    protect,
    restrictTo("admin", "manager"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    updateBrandValidator,
    brandController.updateBrand
  )
  .delete(
    protect,
    restrictTo("admin", "manager"),
    getBrandValidator,
    brandController.deleteBrand
  );

module.exports = router;
