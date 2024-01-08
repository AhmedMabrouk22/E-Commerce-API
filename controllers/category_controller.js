const sharp = require("sharp");

const categoryServices = require("./../services/category_services");
const catchAsync = require("../utils/catchAsync");
const factor = require("./handlersFactory");
const {
  uploadSingleImage,
} = require("./../middlewares/uploadImage_middleware");
const pathHandler = require("./../utils/paths");

exports.uploadCategoryImage = uploadSingleImage("category_image");
exports.resizeImage = catchAsync(async (req, res, next) => {
  if (req.file) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `Category-${uniqueSuffix}.jpeg`;
    const filepath = pathHandler.generatePath(filename);
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 65 })
      .toFile(`./${filepath}`);

    req.body.category_image = filename;
    // i add req.file.fileName for when something wrong happen when validation middleware
    // i will delete image
    req.file.fileName = filename;
  }
  next();
});

// @desc    : Create new Category
// @route   : POST  api/v1/categories
// @access  : Private/Admin-Manager
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
// @access  : Private/Admin-Manager
exports.UpdateCategory = factor.UpdateOne(categoryServices.updateCategoryById);

// @desc    : Delete Category
// @route   : DELETE api/v1/categories/:id
// @access  : Private/Admin-Manager
exports.deleteCategory = factor.deleteOne(categoryServices.deleteCategoryById);
