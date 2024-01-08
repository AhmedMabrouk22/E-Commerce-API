const { param, body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const subCategoryFields = ["subCategory_name", "category_id"];

// Common validation function for subCategory fields
const validateSubCategoryField = (field, optional = false) => {
  let validationChain = body(field)
    .notEmpty()
    .withMessage(`${field} is required`);
  if (optional) validationChain = validationChain.optional();
  return validationChain;
};

exports.subCategoryIdValidator = [
  param("id").notEmpty().isNumeric().withMessage("Invalid subCategory ID"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  filterUnknownFields(subCategoryFields),
  validateSubCategoryField("category_id")
    .isNumeric()
    .withMessage("Invalid category ID"),
  validateSubCategoryField("subCategory_name").trim().toLowerCase(),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  filterUnknownFields([[...subCategoryFields], "category_id"]),
  validateSubCategoryField("subCategory_name", true).trim().toLowerCase(),
  body("category_id").optional().isNumeric().withMessage("Invalid Category ID"),
  validatorMiddleware,
];
