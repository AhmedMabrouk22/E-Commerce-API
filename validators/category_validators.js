const { param, body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validation_middleware");

exports.categoryIdValidator = [
  param("id").isNumeric().withMessage("Invalid category ID"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  body("name").notEmpty().toLowerCase().withMessage("Category must has name"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  param("id").isNumeric().withMessage("Invalid category ID"),
  body("name")
    .optional()
    .notEmpty()
    .toLowerCase()
    .trim()
    .withMessage("Category must has name"),
  validatorMiddleware,
];
