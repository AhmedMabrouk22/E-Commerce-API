const slug = require("slugify");

const categoryServices = require("./../services/category_services");
const httpStatus = require("./../utils/httpStatusText");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// @desc  : Create new Category
// @Route : POST  api/v1/categories
// @access: Private
exports.createCategory = catchAsync(async (req, res, next) => {
  let category = {
    category_name: req.body.name.trim(),
    category_slug: slug(req.body.name).toLowerCase(),
  };

  const result = await categoryServices.createCategory(category);

  res.status(201).json({
    status: httpStatus.SUCCESS,
    category: result,
  });
});

// @desc  : Get specific category
// @Route : GET  api/v1/categories/:id
// @access: Public
exports.getCategoryById = catchAsync(async (req, res, next) => {
  const cat_id = req.params.id;
  const category = await categoryServices.getCategoryById(cat_id);
  if (!category) {
    return next(new AppError(`this category not found`, 404));
  }

  res.status(200).json({
    status: httpStatus.SUCCESS,
    category,
  });
});

// @desc  : Get all categories
// @Route : GET  api/v1/categories/
// @access: Public
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await categoryServices.getAllCategories(req.query);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    result: categories.length,
    categories,
  });
});

// @desc  : Update Category
// @Route : PATCH  api/v1/categories/:id
// @access: Private
exports.UpdateCategory = catchAsync(async (req, res, next) => {
  const category = {
    category_id: req.params.id,
    category_name: req.body.category_name,
  };

  const newCategory = await categoryServices.updateCategoryById(category);
  if (!newCategory) {
    return next(new AppError(`this category not found`, 404));
  }

  res.status(200).json({
    status: httpStatus.SUCCESS,
    category: newCategory,
  });
});
