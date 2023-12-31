const express = require("express");

const subCategoryController = require("./../controllers/subCategory_controller");
const {
  createSubCategoryValidator,
  updateSubCategoryValidator,
  subCategoryIdValidator,
} = require("./../validators/subCategory_validator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(createSubCategoryValidator, subCategoryController.createSubCategory)
  .get(subCategoryController.getAllSubCategories);

router
  .route("/:id")
  .patch(
    subCategoryIdValidator,
    updateSubCategoryValidator,
    subCategoryController.updateSubCategory
  )
  .get(subCategoryIdValidator, subCategoryController.getSubCategory)
  .delete(subCategoryIdValidator, subCategoryController.deleteSubCategory);

module.exports = router;
