const slug = require("slugify");

const brandModel = require("./../models/brand_model");
const ApiFeatures = require("./../utils/apiFeatures");
const buildReqBody = require("./../utils/buildReqBody");

exports.createBrand = async (req) => {
  try {
    // const brand = {
    //   brand_name: req.body.name,
    //   brand_slug: slug(req.body.name.toLowerCase()),
    // };

    let brand = buildReqBody(req.body);
    brand["brand_slug"] = slug(brand["brand_name"].toLowerCase());

    const result = await brandModel.create(brand);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getBrandById = async (req) => {
  try {
    const cat_id = req.params.id;
    let config = {
      filter: { brand_id: cat_id },
    };
    const brand = await brandModel.findById(config);
    return brand;
  } catch (error) {
    throw error;
  }
};

exports.getAllBrands = async (req) => {
  try {
    const stringQuery = req.query;
    const api = new ApiFeatures(stringQuery, {})
      .filter()
      .limitFields()
      .paginate()
      .sort()
      .getApiConfig();
    const brands = await brandModel.find(api);
    return brands;
  } catch (error) {
    throw error;
  }
};

exports.updateBrandById = async (req) => {
  let brand = buildReqBody(req.body);
  brand["brand_id"] = req.params.id;
  if (brand["brand_name"]) {
    brand["brand_slug"] = slug(brand["brand_name"].toLowerCase());
  }
  // if (req.body.name) {
  //   brand.brand_name = req.body.name;
  //   brand.brand_slug = slug(req.body.name.toLowerCase());
  // }

  const newBrand = await brandModel.updateById(brand);

  return newBrand;
};

exports.deleteBrandById = async (brand_id) => {
  return await brandModel.deleteById(brand_id);
};
