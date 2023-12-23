const AppError = require("../utils/appError");
const pool = require("./../config/db");

exports.create = async (category) => {
  try {
    const query = `INSERT INTO categories (category_name,category_slug,category_image) VALUES($1,$2,$3) RETURNING *`;
    const values = [
      category.category_name,
      category.category_slug,
      category.category_image,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
