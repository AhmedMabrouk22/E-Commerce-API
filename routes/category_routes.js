const express = require("express");

const categoryController = require("./../controllers/category_controller");

const router = express.Router();

router
  .route("/")
  .post(categoryController.createCategory)
  .get(categoryController.getAllCategories);
router.route("/:id").get(categoryController.getCategoryById);

module.exports = router;
