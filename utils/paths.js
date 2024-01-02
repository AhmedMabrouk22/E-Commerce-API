const path = require("path");

const BASE_PATH = "uploads";

exports.generatePath = (filename) => {
  if (filename.startsWith("Category"))
    return path.join(BASE_PATH, "categories", filename);
};
