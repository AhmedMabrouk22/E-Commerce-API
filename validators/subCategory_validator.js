const { param, body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const subCategoryFields = ["subCategory_name"];

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
  param("categoryId")
    .notEmpty()
    .withMessage("subCategory must belong to category")
    .isNumeric()
    .withMessage("Please add valid ID"),
  validateSubCategoryField("subcategory_name").trim().toLowerCase(),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  filterUnknownFields([[...subCategoryFields], "category_id"]),
  validateSubCategoryField("subcategory_name", true).trim().toLowerCase(),
  body("category_id").optional().isNumeric().withMessage("Invalid Category ID"),
  validatorMiddleware,
];
