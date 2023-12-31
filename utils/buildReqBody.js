const AppError = require("./appError");

module.exports = (body) => {
  let obj = {};
  Object.entries(body).forEach(([key, val]) => {
    obj[`${key}`] = val;
  });

  if (!obj || Object.keys(obj).length === 0) {
    throw new AppError(`Invalid request body data`, 400);
  }

  return obj;
};
