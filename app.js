const express = require("express");
const morgan = require("morgan");

const globalError = require("./middlewares/error_middleware");
const AppError = require("./utils/appError");
const categoryRouter = require("./routes/category_routes");
const subCategoryRouter = require("./routes/subCategory_routes");
const brandRouter = require("./routes/brand_routes");
const productRouter = require("./routes/product_routes");
const userRouter = require("./routes/user_routes");
const reviewRouter = require("./routes/review_routes");
const wishlistRouter = require("./routes/wishlist_routes");
const addressRouter = require("./routes/address_routes");
const couponRouter = require("./routes/coupon_routes");
const cartRouter = require("./routes/shoppingCart_routes");
const orderRouter = require("./routes/order_routes");
const { webhookCheckout } = require("./controllers/order_controller");

// Start express app
const app = express();

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

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
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/shoppingCart", cartRouter);
app.use("/api/v1/orders", orderRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);

module.exports = app;
