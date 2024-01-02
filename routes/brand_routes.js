const express = require("express");

const brandController = require("./../controllers/brand_controllers");
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
} = require("./../validators/brand_validation");

const router = express.Router();

router
  .route("/")
  .post(
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
    brandController.uploadBrandImage,
    brandController.resizeImage,
    updateBrandValidator,
    brandController.updateBrand
  )
  .delete(getBrandValidator, brandController.deleteBrand);

module.exports = router;
