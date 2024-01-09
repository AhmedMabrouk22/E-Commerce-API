const { param, body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const orderFields = ["shipping_address_id", "payment_method"];

const validateOrderField = (field, optional = false) => {
  let validationChain = body(field)
    .notEmpty()
    .withMessage(`${field} is required`);
  if (optional) validationChain = validationChain.optional();
  return validationChain;
};

exports.orderIdValidator = [
  param("id").notEmpty().isInt().withMessage("Invalid order ID"),
  validatorMiddleware,
];

exports.createOrderValidator = [
  filterUnknownFields(orderFields),
  validateOrderField("shipping_address_id")
    .isInt()
    .withMessage("Invalid address id"),
  validateOrderField("payment_method")
    .trim()
    .toLowerCase()
    .isIn(["card", "cash"])
    .withMessage(
      "Invalid payment method value, payment method must be card or cash"
    ),
  validatorMiddleware,
];

exports.updateOrderStatusValidator = [
  param("id").notEmpty().isInt().withMessage("Invalid order ID"),
  filterUnknownFields(["status"]),
  validateOrderField("status")
    .trim()
    .toLowerCase()
    .isIn(["pending", "processing", "shipped"])
    .withMessage(
      "Invalid status value, status must be pending or processing or shipped"
    ),
  validatorMiddleware,
];
