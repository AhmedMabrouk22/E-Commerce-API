const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.error("Unhandled Exception ERROR 💥️:", err);
  process.exit(1);
});

const app = require("./app");
const pool = require("./config/db");

// Database connection
pool.connect().then(() => console.log("Connected to the database"));

// Run server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port} ...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.message);
  console.error("Unhandled Rejection ERROR 💥️:", err);
  server.close(() => {
    process.exit(1);
  });
});
