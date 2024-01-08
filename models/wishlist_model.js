const { assign } = require("nodemailer/lib/shared");
const pool = require("./../config/db");
const DatabaseQuery = require("./../utils/database");

exports.add = async (wishlist) => {
  try {
    // user_id,product_id
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(wishlist);
    const result = await DatabaseQuery.insert(
      pool,
      {
        fields: fieldsAndValues[0],
        table: "wishlist",
      },
      fieldsAndValues[1]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.delete = async (user_id, product_id) => {
  try {
    const result = await DatabaseQuery.delete(pool, {
      table: "wishlist",
      where: { user_id, product_id },
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.get = async (user_id) => {
  try {
    const result = await DatabaseQuery.select(pool, {
      table: "product_wishlist_view",
      where: { user_id },
    });
    return result.rows;
  } catch (error) {
    throw error;
  }
};
