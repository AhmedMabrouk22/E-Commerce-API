const brandServices = require("./../services/brand_services");
const factor = require("./handlersFactory");

exports.createBrand = factor.createOne(brandServices.createBrand);
exports.getBrands = factor.get(brandServices.getAllBrands);
exports.getBrand = factor.getOne(brandServices.getBrandById);
exports.updateBrand = factor.UpdateOne(brandServices.updateBrandById);
exports.deleteBrand = factor.deleteOne(brandServices.deleteBrandById);
