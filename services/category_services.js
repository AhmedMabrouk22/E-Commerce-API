const categoryModel = require("./../models/category_model");

exports.createCategory = async (catReq) => {
  try {
    return await categoryModel.create(catReq);
  } catch (error) {
    throw error;
  }
};
