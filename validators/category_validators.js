const { param, body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validation_middleware");

exports.categoryIdValidator = [
  param("id").isNumeric().withMessage("Invalid category ID"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  body("name")
    .notEmpty()
    .toLowerCase()
    .withMessage("Category name must has name"),
  validatorMiddleware,
];
