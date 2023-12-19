const dotenv = require("dotenv");

const app = require("./app");

dotenv.config({
  path: "./.env",
});

// Run server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port} ...`);
});
