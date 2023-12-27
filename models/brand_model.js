const DatabaseQuery = require("./../utils/database");

exports.create = async (brand) => {
  try {
    const values = [brand.brand_name, brand.brand_slug, brand.brand_image];
    const db = new DatabaseQuery({
      table: "brands",
      fields: ["brand_name", "brand_slug", "brand_image"],
    });
    const result = await db.insert(values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.find = async (config) => {
  try {
    const db = new DatabaseQuery({
      table: "brands",
      fields: config.fields,
      where: config.filter,
      orderBy: config.sort,
      limit: config.paginate,
    });
    const result = await db.select();
    return result.rows;
  } catch (error) {
    throw error;
  }
};

exports.findById = async (config) => {
  try {
    const db = new DatabaseQuery({
      where: config.filter,
      table: "brands",
    });

    const result = await db.select();
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateById = async (brand) => {
  try {
    const db = new DatabaseQuery({
      table: "brands",
      where: { brand_id: brand.brand_id },
    });

    let obj = {};
    if (brand.brand_name) {
      obj.brand_name = brand.brand_name;
      obj.brand_slug = brand.brand_slug;
    }

    const result = await db.update(obj);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteById = async (brand_id) => {
  try {
    const db = new DatabaseQuery({
      table: "brands",
      where: { brand_id },
    });
    const result = await db.delete();
    return result.rowCount;
  } catch (error) {
    throw error;
  }
};
