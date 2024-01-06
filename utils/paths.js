const path = require("path");

const BASE_PATH = "uploads";

exports.generatePath = (filename) => {
  if (filename.startsWith("Category"))
    return path.join(BASE_PATH, "categories", filename);
  else if (filename.startsWith("Brand"))
    return path.join(BASE_PATH, "brands", filename);
  else if (filename.startsWith("Product"))
    return path.join(BASE_PATH, "products", filename);
  else if (filename.startsWith("User"))
    return path.join(BASE_PATH, "users", filename);
};
