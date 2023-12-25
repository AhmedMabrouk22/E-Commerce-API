const slug = require("slugify");

const AppError = require("../utils/appError");
const categoryModel = require("./../models/category_model");

const defaultImage = (category) => {
  category.category_image = "category_default.jpg";
};

exports.createCategory = async (catReq) => {
  try {
    const category = await categoryModel.create(catReq);
    if (!category.category_image) {
      defaultImage(category);
    }
  } catch (error) {
    throw error;
  }
};

exports.getCategoryById = async (cat_id) => {
  try {
    let config = {
      filter: { category_id: cat_id },
    };
    const category = await categoryModel.findById(config);

    if (category && !category.category_image) {
      defaultImage(category);
    }
    return category;
  } catch (error) {
    throw error;
  }
};

exports.getAllCategories = async (stringQuery) => {
  try {
    let config = {};

    // filter
    const queryObj = { ...stringQuery };
    const excludeFields = ["sort", "page", "limit", "fields"];
    excludeFields.forEach((elm) => {
      delete queryObj[elm];
    });
    config.filter = queryObj;

    // sorting
    if (stringQuery.sort) {
      config.sort = stringQuery.sort.split(",");
    }

    // Paginate
    const page = stringQuery.page * 1 || 1;
    const limit = stringQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;
    config.paginate = { limit, skip };

    // limitFields
    if (stringQuery.fields) {
      const fields = stringQuery.fields.split(",");
      config.fields = fields;
    } else {
      config.fields = "*";
    }

    // sort

    return await categoryModel.find(config);
  } catch (error) {
    throw error;
  }
};

exports.updateCategoryById = async (category) => {
  category.category_name = category.category_name.trim();
  category.category_slug = slug(category.category_name).toLowerCase();

  const newCategory = await categoryModel.updateById(category);
  if (newCategory && !newCategory.category_image) {
    defaultImage(newCategory);
  }

  return newCategory;
};

exports.deleteCategoryById = async (category_id) => {
  return await categoryModel.deleteById(category_id);
};
