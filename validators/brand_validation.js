const { body, param } = require("express-validator");

const validatorMiddleware = require("./../middlewares/validation_middleware");

exports.createBrandValidator = [
  body("name")
    .notEmpty()
    .trim()
    .toLowerCase()
    .withMessage("Brand must has name"),
  validatorMiddleware,
];

exports.getBrandValidator = [
  param("id").notEmpty().isNumeric().withMessage("Invalid ID"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  param("id").notEmpty().isNumeric().withMessage("Invalid ID"),
  body("name")
    .optional()
    .notEmpty()
    .trim()
    .toLowerCase()
    .withMessage("Brand must has name"),
  validatorMiddleware,
];
