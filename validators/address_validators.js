const { param, body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const addressFields = ["address_alias", "country", "city", "street"];

const validateAddressField = (field, optional = false) => {
  let validationChain = body(field)
    .notEmpty()
    .withMessage(`${field} is required`);
  if (optional) validationChain = validationChain.optional();
  return validationChain;
};

exports.addressIdValidator = [
  param("id").notEmpty().isInt().withMessage("Invalid address ID"),
  validatorMiddleware,
];

exports.createAddressValidator = [
  filterUnknownFields(addressFields),
  validateAddressField("address_alias").trim(),
  validateAddressField("country").trim().toLowerCase(),
  validateAddressField("city").trim().toLowerCase(),
  validateAddressField("street").trim().toLowerCase(),
  validatorMiddleware,
];

exports.updateAddressValidator = [
  param("id").notEmpty().isInt().withMessage("Invalid address ID"),
  filterUnknownFields(addressFields),
  validateAddressField("address_alias", true).trim(),
  validateAddressField("country", true).trim().toLowerCase().isLocale(),
  validateAddressField("city", true).trim().toLowerCase(),
  validateAddressField("street", true).trim().toLowerCase(),
  validatorMiddleware,
];
