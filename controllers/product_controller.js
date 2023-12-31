const productService = require("./../services/product_services");
const factor = require("./handlersFactory");

exports.createProduct = factor.createOne(productService.createProduct);
exports.getAllProducts = factor.get(productService.getAllProducts);
exports.getAllProduct = factor.getOne(productService.getAllProductById);
exports.deleteProduct = factor.deleteOne(productService.deleteProductById);
exports.updateProduct = factor.UpdateOne(productService.updateProductById);
