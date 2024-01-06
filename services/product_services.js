const slug = require("slugify");

const productModel = require("./../models/product_model");
const ApiFeatures = require("./../utils/apiFeatures");
const buildReqBody = require("./../utils/buildReqBody");
const fileHandler = require("./../utils/file");

exports.createProduct = async (req) => {
  try {
    // const product = {
    //   product_title: req.body.product_title,
    //   product_slug: slug(req.body.product_title.toLowerCase()),
    //   product_description: req.body.product_description,
    //   product_quantity: req.body.product_quantity,
    //   product_price: req.body.product_price,
    //   category_id: req.body.category_id,
    //   brand_id: req.body.brand_id,
    //   product_cover: req.body.product_title,
    //   create_at: new Date(Date.now()).toISOString(),
    //   update_at: new Date(Date.now()).toISOString(),
    //   product_sub_categories: req.body.product_sub_categories,
    // };

    let product = buildReqBody(req.body);
    // let product = {};
    // Object.entries(req.body).forEach(([key, val]) => {
    //   product[`${key}`] = val;
    // });

    product["product_slug"] = slug(req.body.product_title.toLowerCase());
    product["create_at"] = new Date(Date.now()).toISOString();
    product["update_at"] = new Date(Date.now()).toISOString();

    const result = await productModel.create(product);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getAllProducts = async (req) => {
  try {
    const stringQuery = req.query;
    const api = new ApiFeatures(stringQuery, {})
      .filter()
      .limitFields()
      .paginate()
      .sort()
      .getApiConfig();
    const products = await productModel.find(api);
    return products;
  } catch (error) {
    throw error;
  }
};

exports.getAllProductById = async (req) => {
  try {
    const product_id = req.params.id;
    let config = {
      filter: { product_id: product_id },
    };
    const product = await productModel.findById(config);
    return product;
  } catch (error) {
    throw error;
  }
};

exports.deleteProductById = async (product_id) => {
  const product = await productModel.deleteById(product_id);
  if (product) {
    fileHandler.deleteFiles([
      product["product_cover"],
      ...product["product_images"],
    ]);
  }
  return product;
};

exports.updateProductById = async (req) => {
  try {
    let product = buildReqBody(req.body);
    product["product_id"] = req.params.id;

    if (product["product_title"]) {
      product["product_slug"] = slug(product["product_title"].toLowerCase());
    }
    product["update_at"] = new Date(Date.now()).toISOString();

    let product_cover_image;
    if (req.body.product_cover) {
      const image = await productModel.findById({
        fields: ["product_cover"],
        filter: { product_id: req.params.id },
      });
      if (image) {
        product_cover_image = image["product_cover"];
      }
    }

    const newProduct = await productModel.updateById(product);

    if (!newProduct) {
      const images = [];
      if (newProduct.product_cover) images.push(newProduct.product_cover);
      if (newProduct.product_images) images.push(...newProduct.product_images);
      fileHandler.deleteFiles(images);
    }

    if (product_cover_image) {
      fileHandler.deleteFile(product_cover_image);
    }
    return newProduct;
  } catch (error) {
    throw error;
  }
};
