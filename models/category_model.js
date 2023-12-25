const DatabaseQuery = require("./../utils/database");

exports.create = async (category) => {
  try {
    const values = [
      category.category_name,
      category.category_slug,
      category.category_image,
    ];

    const db = new DatabaseQuery({
      table: "categories",
      fields: ["category_name", "category_slug", "category_image"],
    });

    const result = await db.insert(values);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.findById = async (config) => {
  try {
    const db = new DatabaseQuery({
      where: config.filter,
      table: "categories",
    });

    const result = await db.select();
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.find = async (config) => {
  try {
    const db = new DatabaseQuery({
      fields: config.fields,
      table: "categories",
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

exports.updateById = async (category) => {
  try {
    const db = new DatabaseQuery({
      table: "categories",
      where: { category_id: category.category_id },
    });
    const result = await db.update({
      category_name: category.category_name,
      category_slug: category.category_slug,
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteById = async (category_id) => {
  try {
    const db = new DatabaseQuery({
      table: "categories",
      where: { category_id },
    });
    const result = await db.delete();
    return result.rowCount;
  } catch (error) {
    throw error;
  }
};
