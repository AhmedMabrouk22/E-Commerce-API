const { validationResult } = require("express-validator");

const AppError = require("./../utils/appError");
const fileHandler = require("./../utils/file");

module.exports = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    if (req.file) {
      const fileName = req.file.fileName;
      fileHandler.deleteFile(fileName);
    }
    if (req.files) {
      for (const elm of req.files.filesNames) {
        fileHandler.deleteFile(elm);
      }
    }
    return next(new AppError(error.array()[0].msg, 400));
  }
  next();
};
