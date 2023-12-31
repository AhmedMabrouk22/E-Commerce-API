const { body, param } = require("express-validator");

const validatorMiddleware = require("./../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const productFields = [
  "product_title",
  "product_description",
  "product_quantity",
  "product_price",
  "category_id",
  "brand_id",
  "product_sub_categories",
];

exports.IDProductValidator = [
  param("id").isNumeric().notEmpty().withMessage("Invalid ID"),
  validatorMiddleware,
];

exports.createProductValidator = [
  filterUnknownFields(productFields),
  body("product_title")
    .notEmpty()
    .trim()
    .toLowerCase()
    .withMessage("Product title is required"),
  body("product_description")
    .notEmpty()
    .trim()
    .toLowerCase()
    .withMessage("Product description is required"),
  body("product_quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 1 })
    .withMessage("Invalid product quantity value"),
  body("product_price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric({ min: 1 })
    .withMessage("Invalid product price value"),
  body("category_id")
    .notEmpty()
    .withMessage("Product category_id is required")
    .isInt()
    .withMessage("Invalid category ID"),
  body("brand_id")
    .notEmpty()
    .withMessage("Product brand_id is required")
    .isInt()
    .withMessage("Invalid brand ID"),
  body("product_sub_categories")
    .notEmpty()
    .withMessage("Product subCategories is required")
    .isArray({
      min: 1,
    })
    .withMessage(
      "Invalid product subCategories value and product must be has one or more subCategory"
    ),
  body("product_sub_categories.*")
    .notEmpty()
    .isInt()
    .withMessage("Product subCategories IDs must be numbers"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  filterUnknownFields(productFields),
  body("product_title")
    .optional()
    .notEmpty()
    .trim()
    .toLowerCase()
    .withMessage("Product title is required"),
  body("product_description")
    .optional()
    .notEmpty()
    .trim()
    .toLowerCase()
    .withMessage("Product description is required"),
  body("product_quantity")
    .optional()
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 1 })
    .withMessage("Invalid product quantity value"),
  body("product_price")
    .optional()
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric({ min: 1 })
    .withMessage("Invalid product price value"),
  body("category_id")
    .optional()
    .notEmpty()
    .withMessage("Product category_id is required")
    .isInt()
    .withMessage("Invalid category ID"),
  body("brand_id")
    .optional()
    .notEmpty()
    .withMessage("Product brand_id is required")
    .isInt()
    .withMessage("Invalid brand ID"),
  body("product_sub_categories")
    .optional()
    .notEmpty()
    .withMessage("Product subCategories is required")
    .isArray({
      min: 1,
    })
    .withMessage(
      "Invalid product subCategories value and product must be has one or more subCategory"
    ),
  body("product_sub_categories.*")
    .optional()
    .notEmpty()
    .isInt()
    .withMessage("Product subCategories IDs must be numbers"),
  validatorMiddleware,
];
