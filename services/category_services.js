const slug = require("slugify");

const categoryModel = require("./../models/category_model");
const ApiFeatures = require("./../utils/apiFeatures");

const defaultImage = (category) => {
  if (category && category.category_image === undefined) {
    category.category_image = "category_default.jpg";
  }
};

exports.createCategory = async (req) => {
  try {
    const catReq = {
      category_name: req.body.name.trim(),
      category_slug: slug(req.body.name).toLowerCase(),
    };

    const category = await categoryModel.create(catReq);
    defaultImage(category);
    return category;
  } catch (error) {
    throw error;
  }
};

exports.getCategoryById = async (req) => {
  try {
    const cat_id = req.params.id;
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

exports.getAllCategories = async (req) => {
  try {
    const stringQuery = req.query;
    const api = new ApiFeatures(stringQuery, {})
      .filter()
      .limitFields()
      .paginate()
      .sort()
      .getApiConfig();
    const categories = await categoryModel.find(api);
    categories.forEach((elm) => defaultImage(elm));
    return categories;
  } catch (error) {
    throw error;
  }
};

exports.updateCategoryById = async (req) => {
  let category = {
    category_id: req.params.id,
  };
  if (req.body.name) {
    category.category_name = req.body.name.trim();
    category.category_slug = slug(req.body.name.toLowerCase());
  }

  const newCategory = await categoryModel.updateById(category);
  if (newCategory && !newCategory.category_image) {
    defaultImage(newCategory);
  }

  return newCategory;
};

exports.deleteCategoryById = async (category_id) => {
  return await categoryModel.deleteById(category_id);
};
