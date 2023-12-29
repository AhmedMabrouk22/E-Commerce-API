const pool = require("./../config/db");
const DatabaseQuery = require("./../utils/database");

exports.create = async (brand) => {
  try {
    const values = [brand.brand_name, brand.brand_slug, brand.brand_image];
    const result = await DatabaseQuery.insert(
      pool,
      {
        table: "brands",
        fields: ["brand_name", "brand_slug", "brand_image"],
      },
      values
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.find = async (config) => {
  try {
    const result = await DatabaseQuery.select(pool, {
      table: "brands",
      fields: config.fields,
      where: config.filter,
      orderBy: config.sort,
      limit: config.paginate,
    });
    return result.rows;
  } catch (error) {
    throw error;
  }
};

exports.findById = async (config) => {
  try {
    const result = await DatabaseQuery.select(pool, {
      where: config.filter,
      table: "brands",
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateById = async (brand) => {
  try {
    const result = await DatabaseQuery.update(
      pool,
      {
        table: "brands",
        where: { brand_id: brand.brand_id },
        fields: ["brand_name", "brand_slug"],
      },
      [brand.brand_name, brand.brand_slug]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteById = async (brand_id) => {
  try {
    const result = await DatabaseQuery.delete(pool, {
      where: { brand_id },
      table: "brands",
    });
    return result.rowCount;
  } catch (error) {
    throw error;
  }
};
