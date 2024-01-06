const express = require("express");
const morgan = require("morgan");

const categoryRouter = require("./routes/category_routes");
const subCategoryRouter = require("./routes/subCategory_routes");
const brandRouter = require("./routes/brand_routes");
const productRouter = require("./routes/product_routes");
const globalError = require("./middlewares/error_middleware");
const AppError = require("./utils/appError");

// Start express app
const app = express();

// 1) Global middlewares
app.use(express.static("./uploads"));
app.use(express.json());

// 2) Development logging
if (process.env.NODE_ENV == "development") {
  console.log("===============================");
  console.log("Development mood");
  console.log("===============================");
  app.use(morgan("dev"));
}

// 3) Routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subCategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);

module.exports = app;
