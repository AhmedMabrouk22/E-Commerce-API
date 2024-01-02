const { body, param } = require("express-validator");

const validatorMiddleware = require("./../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const brandFields = ["brand_name"];

// Common validation function for brand fields
const validateBrandField = (field, optional = false) => {
  let validationChain = body(field)
    .notEmpty()
    .withMessage(`${field} is required`);
  if (optional) validationChain = validationChain.optional();
  return validationChain;
};

exports.getBrandValidator = [
  param("id").notEmpty().isNumeric().withMessage("Invalid brand ID"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  filterUnknownFields(brandFields),
  validateBrandField("brand_name").trim().toLowerCase(),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  filterUnknownFields(brandFields),
  validateBrandField("brand_name", true).trim().toLowerCase(),
  validatorMiddleware,
];
