const slug = require("slugify");

const categoryModel = require("./../models/category_model");
const ApiFeatures = require("./../utils/apiFeatures");
const buildReqBody = require("./../utils/buildReqBody");
const fileHandler = require("./../utils/file");

const defaultImage = (category) => {
  if (category && category.category_image === undefined) {
    category.category_image = "category_default.jpg";
  }
};

exports.createCategory = async (req) => {
  try {
    // const catReq = {
    //   category_name: req.body.name.trim(),
    //   category_slug: slug(req.body.name).toLowerCase(),
    // };

    let catReq = buildReqBody(req.body);
    catReq["category_slug"] = slug(catReq["category_name"].toLowerCase());

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
    // categories.forEach((elm) => defaultImage(elm));
    return categories;
  } catch (error) {
    throw error;
  }
};

exports.updateCategoryById = async (req) => {
  let category = buildReqBody(req.body);
  category["category_id"] = req.params.id;
  if (category["category_name"]) {
    category["category_slug"] = slug(category["category_name"].toLowerCase());
  }

  let imagePath;
  if (req.body.category_image) {
    const image = await categoryModel.findById({
      fields: ["category_image"],
      filter: { category_id: req.params.id },
    });
    if (image) {
      imagePath = image["category_image"];
    }
  }

  const newCategory = await categoryModel.updateById(category);
  // if (newCategory && !newCategory.category_image) {
  //   defaultImage(newCategory);
  // }

  if (!newCategory) {
    fileHandler.deleteFile(req.body.category_image);
  }

  if (imagePath) {
    fileHandler.deleteFile(imagePath);
  }

  return newCategory;
};

exports.deleteCategoryById = async (category_id) => {
  const category = await categoryModel.deleteById(category_id);
  if (category) {
    fileHandler.deleteFile(category["category_image"]);
  }
  return category;
};
