const express = require("express");
const morgan = require("morgan");

// Start express app
const app = express();

// 1) Global middlewares

// 2) Development logging
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// 3) Routes

module.exports = app;
