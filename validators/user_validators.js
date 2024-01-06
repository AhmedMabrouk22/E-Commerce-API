const { body, param } = require("express-validator");

const validatorMiddleware = require("../middlewares/validation_middleware");
const filterUnknownFields = require("../middlewares/filterUnknownFields");

const userFields = [
  "first_name",
  "last_name",
  "email",
  "password",
  "role_name",
  "phone_number",
  "profile_image",
];

const validateUserField = (field, optional = false) => {
  let validationChain = body(field)
    .notEmpty()
    .withMessage(`${field} is required`);
  if (optional) validationChain = validationChain.optional();
  return validationChain;
};

exports.signupValidator = [
  filterUnknownFields(userFields),
  validateUserField("first_name").trim(),
  validateUserField("last_name").trim(),
  validateUserField("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email value"),
  validateUserField("password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8"),
  validateUserField("role_name", true)
    .trim()
    .isIn(["user", "admin", "manager"])
    .withMessage("Invalid role value, user must be user or admin or manager"),
  validateUserField("phone_number", true)
    .isMobilePhone()
    .withMessage("Invalid phone number value"),
  validatorMiddleware,
];
