const AppError = require("../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const httpStatus = require("./../utils/httpStatusText");

const notFoundMessage = (next) => next(new AppError("Not found data", 404));

exports.createOne = (createServices) =>
  catchAsync(async (req, res, next) => {
    const result = await createServices(req);
    res.status(201).json({
      status: httpStatus.SUCCESS,
      data: result,
    });
  });

exports.deleteOne = (deleteServices) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await deleteServices(id);
    if (!result) {
      return notFoundMessage(next);
    }
    res.status(202).json({
      status: httpStatus.SUCCESS,
      message: "Data deleted successfully",
    });
  });

exports.UpdateOne = (updateServices) =>
  catchAsync(async (req, res, next) => {
    const result = await updateServices(req);
    if (!result) {
      return notFoundMessage(next);
    }

    res.status(200).json({
      status: httpStatus.SUCCESS,
      data: result,
    });
  });

exports.getOne = (getOneServices) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await getOneServices(id);
    if (!result) {
      return notFoundMessage(next);
    }

    res.status(200).json({
      status: httpStatus.SUCCESS,
      data: result,
    });
  });

exports.get = (getServices) =>
  catchAsync(async (req, res, next) => {
    const result = await getServices(req.query);
    res.status(200).json({
      status: httpStatus.SUCCESS,
      result: result.length,
      data: result,
    });
  });
