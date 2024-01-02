const pool = require("./../config/db");
const DatabaseQuery = require("./../utils/database");
const fileHandler = require("./../utils/file");
const pathHandler = require("./../utils/paths");

const getImageName = async (category_id) => {
  const category_image = await DatabaseQuery.select(pool, {
    fields: ["category_image"],
    where: { category_id: category_id },
    table: "categories",
  });
  if (category_image.rowCount === 0) return null;
  else return category_image.rows[0]["category_image"];
};

const deleteImage = (curCategoryImagePath) => {
  if (curCategoryImagePath) {
    const filepath = pathHandler.generatePath(curCategoryImagePath);
    fileHandler.deleteFile(filepath);
  }
};

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
    const filePath = pathHandler.generatePath(category.category_image);
    fileHandler.deleteFile(`./${filePath}`);
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
    // get which fields will be update and their values
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(category);

    // if the category image will be update, get the current image name
    let found = false;
    fieldsAndValues[0].forEach((elm) => {
      if (elm === "category_image") {
        found = true;
        return;
      }
    });

    let curCategoryImagePath;
    if (found === true) {
      curCategoryImagePath = await getImageName(category.category_id);
    }

    const result = await DatabaseQuery.update(
      pool,
      {
        table: "categories",
        where: { category_id: category.category_id },
        fields: fieldsAndValues[0],
      },
      fieldsAndValues[1]
    );

    // if category image updated, delete the old image
    deleteImage(curCategoryImagePath);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteById = async (category_id) => {
  try {
    const curCategoryImagePath = await getImageName(category_id);
    const result = await DatabaseQuery.delete(pool, {
      table: "categories",
      where: { category_id },
    });
    deleteImage(curCategoryImagePath);
    return result.rowCount;
  } catch (error) {
    throw error;
  }
};
