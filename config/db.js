const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
});

module.exports = pool;
