const sharp = require("sharp");

const productService = require("./../services/product_services");
const catchAsync = require("./../utils/catchAsync");
const factor = require("./handlersFactory");
const {
  uploadMixOfImages,
} = require("./../middlewares/uploadImage_middleware");
const pathHandler = require("./../utils/paths");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "product_cover",
    maxCount: 1,
  },
  {
    name: "product_images",
    maxCount: 5,
  },
]);

exports.resizeImage = catchAsync(async (req, res, next) => {
  if (req.files) {
    const filesNames = [];
    if (req.files.product_cover) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `Product-cover-${uniqueSuffix}.jpeg`;
      const filepath = pathHandler.generatePath(filename);
      await sharp(req.files.product_cover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 65 })
        .toFile(`./${filepath}`);

      req.body.product_cover = filename;
      filesNames.push(filename);
    }

    if (req.files.product_images) {
      const images = req.body.product_images || [];
      await Promise.all(
        req.files.product_images.map(async (elm, idx) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const filename = `Product-image[${idx}]-${uniqueSuffix}.jpeg`;
          const filepath = pathHandler.generatePath(filename);
          await sharp(elm.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`./${filepath}`);

          images.push(filename);
          filesNames.push(filename);
        })
      );
      req.body.product_images = images;
    }
    req.files.filesNames = filesNames;
  }

  next();
});

exports.createProduct = factor.createOne(productService.createProduct);
exports.getAllProducts = factor.get(productService.getAllProducts);
exports.getAllProduct = factor.getOne(productService.getAllProductById);
exports.deleteProduct = factor.deleteOne(productService.deleteProductById);
exports.updateProduct = factor.UpdateOne(productService.updateProductById);
