const { body, param } = require("express-validator");

const validatorMiddleware = require("./../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const validateWishlistField = (field, optional = false) => {
  let validationChain = body(field)
    .notEmpty()
    .withMessage(`${field} is required`);
  if (optional) validationChain = validationChain.optional();
  return validationChain;
};

exports.addProductToWishlistValidator = [
  filterUnknownFields("product_id"),
  validateWishlistField("product_id").isInt().withMessage("Invalid product ID"),
  validatorMiddleware,
];

exports.productIdValidator = [
  param("productId").notEmpty().isInt().withMessage("Invalid product ID"),
  validatorMiddleware,
];
