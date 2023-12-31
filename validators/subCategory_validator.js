const { param, body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const subCategoryFields = ["subCategory_name"];
const subCategoryValidator = [
  body("subcategory_name")
    .notEmpty()
    .trim()
    .toLowerCase()
    .withMessage("subCategory must has name"),
];

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
  [...subCategoryValidator],
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  filterUnknownFields([[...subCategoryFields], "category_id"]),
  [...subCategoryValidator].map((rule) => rule.optional()),
  body("category_id").optional().isNumeric().withMessage("Invalid Category ID"),
  validatorMiddleware,
];
