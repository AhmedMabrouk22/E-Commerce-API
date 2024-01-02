const { param, body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const categoryFields = ["category_name", "category_image"];

// Common validation function for category fields
const validateCategoryField = (field, optional = false) => {
  let validationChain = body(field)
    .notEmpty()
    .withMessage(`${field} is required`);
  if (optional) validationChain = validationChain.optional();
  return validationChain;
};

exports.categoryIdValidator = [
  param("id").isNumeric().withMessage("Invalid category ID"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  filterUnknownFields(categoryFields),
  validateCategoryField("category_name").trim().toLowerCase(),
  validateCategoryField("category_image").trim(),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  filterUnknownFields(categoryFields),
  validateCategoryField("category_name", true).trim().toLowerCase(),
  validateCategoryField("category_image", true).trim(),
  validatorMiddleware,
];
