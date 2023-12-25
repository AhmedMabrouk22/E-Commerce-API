const express = require("express");

const categoryController = require("./../controllers/category_controller");
const AppError = require("../utils/appError");
const {
  categoryIdValidator,
  createCategoryValidator,
} = require("../validators/category_validators");

const router = express.Router();

router
  .route("/")
  .post(createCategoryValidator, categoryController.createCategory)
  .get(categoryController.getAllCategories);
router
  .route("/:id")
  .get(categoryIdValidator, categoryController.getCategoryById)
  .patch(
    categoryIdValidator,
    createCategoryValidator,
    categoryController.UpdateCategory
  )
  .delete(categoryIdValidator, categoryController.deleteCategory);

module.exports = router;
