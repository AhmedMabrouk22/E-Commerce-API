const slug = require("slugify");

const categoryModel = require("./../models/category_model");
const ApiFeatures = require("./../utils/apiFeatures");

const defaultImage = (category) => {
  if (category && category.category_image === undefined) {
    category.category_image = "category_default.jpg";
  }
};

exports.createCategory = async (catReq) => {
  try {
    const category = await categoryModel.create(catReq);
    defaultImage(category);
    return category;
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
    defaultImage(category);
    return category;
  } catch (error) {
    throw error;
  }
};

exports.getAllCategories = async (stringQuery) => {
  try {
    let config = {};
    const api = new ApiFeatures(stringQuery, config)
      .filter()
      .limitFields()
      .paginate()
      .sort();
    const categories = await categoryModel.find(config);
    categories.forEach((elm) => defaultImage(elm));
    return categories;
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
