const slug = require("slugify");

const categoryServices = require("./../services/category_services");
const httpStatus = require("./../utils/httpStatusText");
const catchAsync = require("../utils/catchAsync");

exports.createCategory = catchAsync(async (req, res, next) => {
  let category = {
    category_name: req.body.name.trim(),
    category_slug: slug(req.body.name).toLowerCase(),
  };

  const result = await categoryServices.createCategory(category);

  res.status(201).json({
    status: httpStatus.SUCCESS,
    category: result,
  });
});
