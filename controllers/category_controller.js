const slug = require("slugify");

const categoryServices = require("./../services/category_services");
const httpStatus = require("./../utils/httpStatusText");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factor = require("./handlersFactory");

// @desc    : Create new Category
// @route   : POST  api/v1/categories
// @access  : Private
exports.createCategory = factor.createOne(categoryServices.createCategory);

// @desc    : Get specific category
// @route   : GET  api/v1/categories/:id
// @Access  : Public
exports.getCategoryById = factor.getOne(categoryServices.getCategoryById);

// @desc    : Get all categories
// @route   : GET  api/v1/categories/
// @access  : Public
exports.getAllCategories = factor.get(categoryServices.getAllCategories);

// @desc    : Update Category
// @route   : PATCH  api/v1/categories/:id
// @access  : Private
exports.UpdateCategory = factor.UpdateOne(categoryServices.updateCategoryById);

// @desc    : Delete Category
// @route   : DELETE api/v1/categories/:id
// @access  : Private
exports.deleteCategory = factor.deleteOne(categoryServices.deleteCategoryById);
