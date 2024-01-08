const express = require("express");

const subCategoryController = require("./../controllers/subCategory_controller");
const {
  createSubCategoryValidator,
  updateSubCategoryValidator,
  subCategoryIdValidator,
} = require("./../validators/subCategory_validator");
const { protect, restrictTo } = require("./../middlewares/auth_middleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    subCategoryController.setCategoryIDToBody,
    createSubCategoryValidator,
    subCategoryController.createSubCategory
  )
  .get(subCategoryController.getAllSubCategories);

router
  .route("/:id")
  .patch(
    protect,
    restrictTo("admin", "manager"),
    subCategoryIdValidator,
    updateSubCategoryValidator,
    subCategoryController.updateSubCategory
  )
  .get(subCategoryIdValidator, subCategoryController.getSubCategory)
  .delete(
    protect,
    restrictTo("admin", "manager"),
    subCategoryIdValidator,
    subCategoryController.deleteSubCategory
  );

module.exports = router;
