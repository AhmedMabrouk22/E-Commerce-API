const subCategoryServices = require("./../services/subCategory_services");
const factor = require("./handlersFactory");

exports.setCategoryIDToBody = (req, res, next) => {
  if (!req.body.category_id) req.body.category_id = req.params.categoryId;
  next();
};

// @desc    : Create new subCategory
// @route   : POST  api/v1/subCategories
// @access  : Private
exports.createSubCategory = factor.createOne(
  subCategoryServices.createSubCategory
);

// @desc    : Update subCategory
// @route   : PATCH api/v1/subCategories/:id
// @access  : Private
exports.updateSubCategory = factor.UpdateOne(
  subCategoryServices.updateSubCategory
);

// @desc    : Get all subCategories
// @route   : GET api/v1/subCategories/
// @access  : Public
exports.getAllSubCategories = factor.get(
  subCategoryServices.getAllSubCategories
);

// @desc    : Get subCategory
// @route   : GET api/v1/subCategories/:id
// @access  : Public
exports.getSubCategory = factor.getOne(subCategoryServices.getSubCategoryById);

// @desc    : Delete subCategory
// @route   : DELETE api/v1/subCategories/:id
// @access  : Private
exports.deleteSubCategory = factor.deleteOne(
  subCategoryServices.deleteSubCategoryById
);
