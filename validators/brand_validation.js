const { body, param } = require("express-validator");

const validatorMiddleware = require("./../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const brandFields = ["brand_name"];

const brandValidator = [
  body("brand_name")
    .notEmpty()
    .trim()
    .toLowerCase()
    .withMessage("Brand must has name"),
];

exports.getBrandValidator = [
  param("id").notEmpty().isNumeric().withMessage("Invalid brand ID"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  filterUnknownFields(brandFields),
  [...brandValidator],
  validatorMiddleware,
];

exports.updateBrandValidator = [
  filterUnknownFields(brandFields),
  [...brandValidator].map((rule) => rule.optional()),
  validatorMiddleware,
];
