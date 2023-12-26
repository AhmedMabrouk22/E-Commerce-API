const DatabaseQuery = require("../utils/database");

exports.create = async (subCategory) => {
  try {
    const values = [
      subCategory.subCategory_name,
      subCategory.subCategory_slug,
      subCategory.category_id,
    ];
    const db = new DatabaseQuery({
      table: "sub_categories",
      fields: ["subCategory_name", "subCategory_slug", "category_id"],
    });
    const result = await db.insert(values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateById = async (subCategory) => {
  try {
    const db = new DatabaseQuery({
      table: "sub_categories",
      where: { subcategory_id: subCategory.subcategory_id },
    });

    let obj = {};
    if (subCategory.subCategory_name) {
      obj.subCategory_name = subCategory.subCategory_name;
      obj.subCategory_slug = subCategory.subCategory_slug;
    }

    if (subCategory.category_id) {
      obj.category_id = subCategory.category_id;
    }

    const result = await db.update(obj);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.find = async (config) => {
  try {
    const db = new DatabaseQuery({
      fields: config.fields,
      table: "subCategory_view",
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
      table: "subCategory_view",
    });

    const result = await db.select();
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteById = async (subCategory_id) => {
  try {
    const db = new DatabaseQuery({
      table: "sub_categories",
      where: { subcategory_id: subCategory_id },
    });
    const result = await db.delete();
    return result.rowCount;
  } catch (error) {
    throw error;
  }
};
