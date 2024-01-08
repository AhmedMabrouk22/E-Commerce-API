const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const categoryController = require("./../controllers/category_controller");
const {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
} = require("../validators/category_validators");
const subCategoryRouter = require("./subCategory_routes");
const { protect, restrictTo } = require("./../middlewares/auth_middleware");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRouter);

router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    createCategoryValidator,
    categoryController.createCategory
  )
  .get(categoryController.getAllCategories);
router
  .route("/:id")
  .get(categoryIdValidator, categoryController.getCategoryById)
  .patch(
    protect,
    restrictTo("admin", "manager"),
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    categoryIdValidator,
    updateCategoryValidator,
    categoryController.UpdateCategory
  )
  .delete(
    protect,
    restrictTo("admin", "manager"),
    categoryIdValidator,
    categoryController.deleteCategory
  );

module.exports = router;
