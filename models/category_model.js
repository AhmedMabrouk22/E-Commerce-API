const pool = require("./../config/db");
const DatabaseQuery = require("./../utils/database");
const fileHandler = require("./../utils/file");

exports.create = async (category) => {
  try {
    const values = [
      category.category_name,
      category.category_slug,
      category.category_image,
    ];

    const result = await DatabaseQuery.insert(
      pool,
      {
        table: "categories",
        fields: ["category_name", "category_slug", "category_image"],
      },
      values
    );

    return result.rows[0];
  } catch (error) {
    fileHandler.deleteFile(category.category_image);
    throw error;
  }
};

exports.findById = async (config) => {
  try {
    const result = await DatabaseQuery.select(pool, {
      table: "categories",
      where: config.filter,
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.find = async (config) => {
  try {
    const result = await DatabaseQuery.select(pool, {
      fields: config.fields,
      table: "categories",
      where: config.filter,
      orderBy: config.sort,
      limit: config.paginate,
    });
    return result.rows;
  } catch (error) {
    throw error;
  }
};

exports.updateById = async (category) => {
  try {
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(category);

    const result = await DatabaseQuery.update(
      pool,
      {
        table: "categories",
        where: { category_id: category.category_id },
        fields: fieldsAndValues[0],
      },
      fieldsAndValues[1]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteById = async (category_id) => {
  try {
    const result = await DatabaseQuery.delete(pool, {
      table: "categories",
      where: { category_id },
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
