const { param, body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const categoryFields = ["category_name"];
const categoryValidator = [
  body("category_name")
    .notEmpty()
    .toLowerCase()
    .trim()
    .withMessage("Category must has name"),
];

exports.categoryIdValidator = [
  param("id").isNumeric().withMessage("Invalid category ID"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  filterUnknownFields(categoryFields),
  [...categoryValidator],
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  filterUnknownFields(categoryFields),
  [...categoryValidator].map((rule) => rule.optional()),
  validatorMiddleware,
];
