const sharp = require("sharp");

const brandServices = require("./../services/brand_services");
const catchAsync = require("./../utils/catchAsync");
const factor = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImage_middleware");
const pathHandler = require("./../utils/paths");

exports.uploadBrandImage = uploadSingleImage("brand_image");
exports.resizeImage = catchAsync(async (req, res, next) => {
  if (req.file) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `Brand-${uniqueSuffix}.jpeg`;
    const filepath = pathHandler.generatePath(filename);
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 65 })
      .toFile(`./${filepath}`);

    req.body.brand_image = filename;
    req.file.fileName = filename;
  }
  next();
});

// @desc    : Create new Brand
// @route   : POST  api/v1/brands
// @access  : Private/Admin-manager
exports.createBrand = factor.createOne(brandServices.createBrand);

// @desc    : Get all Brands
// @route   : GET  api/v1/brands
// @access  : Public
exports.getBrands = factor.get(brandServices.getAllBrands);

// @desc    : Create specific brand
// @route   : GET  api/v1/brands/:id
// @access  : Public
exports.getBrand = factor.getOne(brandServices.getBrandById);

// @desc    : Update Brand
// @route   : PATCH  api/v1/brands/:id
// @access  : Private/Admin-manager
exports.updateBrand = factor.UpdateOne(brandServices.updateBrandById);

// @desc    : Delete brand
// @route   : DELETE  api/v1/brands/:id
// @access  : Private/Admin-manager
exports.deleteBrand = factor.deleteOne(brandServices.deleteBrandById);
