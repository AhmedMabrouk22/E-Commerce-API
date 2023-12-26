const { param, body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validation_middleware");

exports.subCategoryIdValidator = [
  param("id").isNumeric().withMessage("Invalid category ID"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  body("name")
    .notEmpty()
    .trim()
    .toLowerCase()
    .withMessage("subCategory must has name"),
  param("categoryId")
    .notEmpty()
    .withMessage("subCategory must belong to category")
    .isNumeric()
    .withMessage("Please add valid ID"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  param("id").notEmpty().isNumeric().withMessage("Invalid subCategory ID"),
  body("name").optional().trim().toLowerCase(),
  body("category_id").optional().isNumeric().withMessage("Invalid Category ID"),
  validatorMiddleware,
];
