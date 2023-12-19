const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});

const app = require("./app");
const pool = require("./config/db");

// Database connection
pool
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

// Run server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port} ...`);
});
