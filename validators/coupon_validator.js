const { param, body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const couponFields = ["coupon_code", "expire", "discount"];

const validateCouponField = (field, optional = false) => {
  let validationChain = body(field)
    .notEmpty()
    .withMessage(`${field} is required`);
  if (optional) validationChain = validationChain.optional();
  return validationChain;
};

exports.couponIdValidator = [
  param("code").notEmpty().isString().withMessage("Invalid coupon code"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  filterUnknownFields(couponFields),
  validateCouponField("coupon_code").trim(),
  validateCouponField("expire")
    .isISO8601()
    .toDate()
    .withMessage("Invalid Date Value"),
  validateCouponField("discount")
    .isInt({ min: 1, max: 100 })
    .withMessage("Invalid discount value"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  param("code").notEmpty().isString().withMessage("Invalid coupon code"),
  filterUnknownFields(["expire", "discount"]),
  validateCouponField("expire", true)
    .isISO8601()
    .withMessage("Invalid Date Value"),
  validateCouponField("discount", true)
    .isInt({ min: 1, max: 100 })
    .withMessage("Invalid discount value"),
  validatorMiddleware,
];
