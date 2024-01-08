const { body, param } = require("express-validator");

const validatorMiddleware = require("./../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const reviewFields = ["review_content", "rating", "product_id", "user_id"];

const validateReviewField = (field, optional = false) => {
  let validationChain = body(field)
    .notEmpty()
    .withMessage(`${field} is required`);
  if (optional) validationChain = validationChain.optional();
  return validationChain;
};

exports.getReviewValidator = [
  param("id").notEmpty().isNumeric().withMessage("Invalid review ID"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  filterUnknownFields(reviewFields),
  validateReviewField("review_content").trim().toLowerCase(),
  validateReviewField("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage(`Rating must be between 1 and 5`),
  validateReviewField("user_id").trim().toLowerCase(),
  validateReviewField("product_id").trim().toLowerCase(),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  param("id").notEmpty().isNumeric().withMessage("Invalid review ID"),
  filterUnknownFields(reviewFields),
  validateReviewField("review_content", true).trim().toLowerCase(),
  validateReviewField("rating", true)
    .isInt({ min: 1, max: 5 })
    .withMessage(`Rating must be between 1 and 5`),
  validatorMiddleware,
];
