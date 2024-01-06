const slug = require("slugify");

const subCategoryModel = require("./../models/subCategory_model");
const ApiFeatures = require("./../utils/apiFeatures");
const buildReqBody = require("./../utils/buildReqBody");

exports.createSubCategory = async (req) => {
  try {
    let subCategory = buildReqBody(req.body);
    subCategory["subCategory_slug"] = slug(
      subCategory["subCategory_name"].toLowerCase()
    );
    subCategory["category_id"] = req.params.categoryId * 1;

    const newSubCategory = await subCategoryModel.create(subCategory);
    return newSubCategory;
  } catch (error) {
    throw error;
  }
};

exports.updateSubCategory = async (req) => {
  try {
    // let subCategory = {
    //   subcategory_id: req.params.id,
    // };
    // if (req.body.subcategory_name) {
    //   subCategory["subCategory_name"] = req.body.subcategory_name;
    //   subCategory["subCategory_slug"] = slug(
    //     req.body.subcategory_name.toLowerCase()
    //   );
    // }

    let subCategory = buildReqBody(req.body);

    if (subCategory["subCategory_name"]) {
      subCategory["subCategory_slug"] = slug(
        subCategory["subCategory_name"].toLowerCase()
      );
    }

    subCategory["subcategory_id"] = req.params.id;

    const result = await subCategoryModel.updateById(subCategory);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getAllSubCategories = async (req) => {
  try {
    const stringQuery = req.query;
    const api = new ApiFeatures(stringQuery, {})
      .filter()
      .limitFields()
      .paginate()
      .sort()
      .getApiConfig();

    const category_id = req.params.categoryId;
    if (category_id) {
      api.filter = { ...api.filter, category_id };
    }

    const subCategories = await subCategoryModel.find(api);
    return subCategories;
  } catch (error) {
    throw error;
  }
};

exports.getSubCategoryById = async (req) => {
  try {
    const subCategory_id = req.params.id;
    let config = {
      filter: { subcategory_id: subCategory_id },
    };
    const subCategory = await subCategoryModel.findById(config);
    return subCategory;
  } catch (error) {
    throw error;
  }
};

exports.deleteSubCategoryById = async (subCategory_id) => {
  return await subCategoryModel.deleteById(subCategory_id);
};
