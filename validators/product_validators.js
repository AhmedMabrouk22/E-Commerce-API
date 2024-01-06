const { body, param } = require("express-validator");

const validatorMiddleware = require("./../middlewares/validation_middleware");
const filterUnknownFields = require("./../middlewares/filterUnknownFields");

const productFields = [
  "product_title",
  "product_description",
  "product_quantity",
  "product_price",
  "product_cover",
  "product_images",
  "category_id",
  "brand_id",
  "product_sub_categories",
];

// Common validation function for product fields
const validateProductField = (field, optional = false) => {
  let validationChain = body(field)
    .notEmpty()
    .withMessage(`${field} is required`);
  if (optional) validationChain = validationChain.optional();
  return validationChain;
};

exports.IDProductValidator = [
  param("id").isNumeric().notEmpty().withMessage("Invalid ID"),
  validatorMiddleware,
];

exports.createProductValidator = [
  filterUnknownFields(productFields),
  validateProductField("product_title").toLowerCase().trim(),
  validateProductField("product_description").trim(),
  validateProductField("product_quantity")
    .isInt({ min: 1 })
    .withMessage("Invalid product quantity value"),
  validateProductField("product_price")
    .isNumeric({ min: 1 })
    .withMessage("Invalid product price value"),
  validateProductField("product_cover").trim(),
  validateProductField("product_images")
    .isArray({
      min: 1,
      max: 5,
    })
    .withMessage("Invalid product_images value"),
  validateProductField("product_images.*")
    .isString()
    .withMessage("Invalid product images value")
    .trim(),
  validateProductField("category_id")
    .isInt()
    .withMessage("Invalid category ID"),
  validateProductField("brand_id").isInt().withMessage("Invalid brand ID"),
  validateProductField("product_sub_categories")
    .isArray({
      min: 1,
    })
    .withMessage(
      "Invalid product subCategories value and product must be has one or more subCategory"
    ),
  validateProductField("product_sub_categories.*")
    .isInt()
    .withMessage("Product subCategories IDs must be numbers"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  filterUnknownFields(productFields),
  validateProductField("product_title", true).toLowerCase().trim(),
  validateProductField("product_description", true).trim(),
  validateProductField("product_quantity", true)
    .optional()
    .isInt({ min: 1 })
    .withMessage("Invalid product quantity value"),
  validateProductField("product_price", true)
    .isNumeric({ min: 1 })
    .withMessage("Invalid product price value"),
  validateProductField("product_cover", true).trim(),
  validateProductField("product_images", true).isArray({
    min: 1,
  }),
  validateProductField("product_images.*")
    .isString()
    .withMessage("Invalid product images value")
    .trim(),
  validateProductField("category_id", true)
    .isInt()
    .withMessage("Invalid category ID"),
  validateProductField("brand_id", true)
    .isInt()
    .withMessage("Invalid brand ID"),
  validateProductField("product_sub_categories", true)
    .isArray({
      min: 1,
    })
    .withMessage(
      "Invalid product subCategories value and product must be has one or more subCategory"
    ),
  validateProductField("product_sub_categories.*")
    .isInt()
    .withMessage("Product subCategories IDs must be numbers"),
  validatorMiddleware,
];
