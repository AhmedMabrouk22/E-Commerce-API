const slug = require("slugify");

const brandModel = require("./../models/brand_model");
const ApiFeatures = require("./../utils/apiFeatures");
const buildReqBody = require("./../utils/buildReqBody");
const fileHandler = require("./../utils/file");

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
  try {
    let brand = buildReqBody(req.body);
    brand["brand_id"] = req.params.id;
    if (brand["brand_name"]) {
      brand["brand_slug"] = slug(brand["brand_name"].toLowerCase());
    }

    let brandImagePath;
    if (req.body.brand_image) {
      const image = await brandModel.findById({
        fields: ["brand_image"],
        filter: { brand_id: req.params.id },
      });
      if (image) {
        brandImagePath = image["brand_image"];
      }
    }
    const newBrand = await brandModel.updateById(brand);

    if (!newBrand) {
      fileHandler.deleteFile(req.body.brand_image);
    }

    if (brandImagePath) {
      fileHandler.deleteFile(brandImagePath);
    }
    return newBrand;
  } catch (error) {
    throw error;
  }
};

exports.deleteBrandById = async (req) => {
  try {
    const brand_id = req.params.id;
    const brand = await brandModel.deleteById(brand_id);
    if (brand) {
      fileHandler.deleteFile(brand["brand_image"]);
    }
    return brand;
  } catch (error) {
    throw error;
  }
};
