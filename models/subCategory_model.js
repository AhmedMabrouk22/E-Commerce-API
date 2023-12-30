const pool = require("./../config/db");
const DatabaseQuery = require("../utils/database");

exports.create = async (subCategory) => {
  try {
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(subCategory);

    const result = await DatabaseQuery.insert(
      pool,
      {
        table: "sub_categories",
        fields: fieldsAndValues[0],
      },
      fieldsAndValues[1]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateById = async (subCategory) => {
  try {
    let obj = { ...subCategory };
    delete obj.subcategory_id;
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(obj); // [fields,values]
    if (!fieldsAndValues) {
      throw new Error(`something wrong in fieldsAndValues`);
    }

    const result = await DatabaseQuery.update(
      pool,
      {
        table: "sub_categories",
        where: { subcategory_id: subCategory.subcategory_id },
        fields: fieldsAndValues[0],
      },
      fieldsAndValues[1]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.find = async (config) => {
  try {
    const result = await DatabaseQuery.select(pool, {
      fields: config.fields,
      table: "subCategory_view",
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
      table: "subCategory_view",
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteById = async (subCategory_id) => {
  try {
    const result = await DatabaseQuery.delete(pool, {
      table: "sub_categories",
      where: { subcategory_id: subCategory_id },
    });
    return result.rowCount;
  } catch (error) {
    throw error;
  }
};
