const AppError = require("../utils/appError");
const pool = require("./../config/db");
const DatabaseQuery = require("./../utils/database");
const fileHandler = require("./../utils/file");

// Check if subCategory belong to category
const isBelongToCategory = async (client, category_id, subCategory_id) => {
  try {
    const isExist = await DatabaseQuery.select(client, {
      table: "sub_categories",
      fields: ["subCategory_id"],
      where: { category_id: category_id, subCategory_id: subCategory_id },
    });

    if (isExist.rowCount === 0) {
      throw new AppError(
        `SubCategory id ${subCategory_id} not belong to category_id ${category_id}`,
        400
      );
    }
  } catch (error) {
    throw error;
  }
};

const addSubCategory = async (
  client,
  subCategories,
  product_id,
  category_id
) => {
  try {
    for (const elm of subCategories) {
      await isBelongToCategory(client, category_id, elm);
      const res = await DatabaseQuery.insert(
        client,
        {
          table: "product_sub_categories",
          fields: ["product_id", "subCategory_id"],
        },
        [product_id, elm]
      );
    }
  } catch (error) {
    throw error;
  }
};

const deleteSubCategory = async (client, subCategories, product_id) => {
  try {
    for (const elm of subCategories) {
      const res = await DatabaseQuery.delete(client, {
        table: "product_sub_categories",
        where: { subcategory_id: elm, product_id },
      });
    }
  } catch (error) {
    throw error;
  }
};

const updateSubCategories = async (client, product, subCategories) => {
  try {
    // 1 - get the current product subCategories
    const curSubCategories = await DatabaseQuery.select(client, {
      table: "product_sub_categories",
      fields: ["subcategory_id"],
      where: { product_id: product.product_id },
    });

    const subCategoriesMap = new Map();
    curSubCategories.rows.forEach((elm) => {
      subCategoriesMap.set(elm.subcategory_id * 1, true);
    });

    // 2 - select the new subCategories and the deleted subCategories
    const add = [];
    const remove = [];

    for (const elm of subCategories) {
      if (subCategoriesMap.has(elm) === false) {
        add.push(elm);
      } else {
        subCategoriesMap.delete(elm);
      }
    }

    subCategoriesMap.forEach((value, key) => {
      remove.push(key);
    });

    // Delete SubCategories
    await deleteSubCategory(client, remove, product.product_id);

    // Add new SubCategories
    await addSubCategory(client, add, product.product_id, product.category_id);
  } catch (error) {
    throw error;
  }
};

// add images
const addImage = async (client, images, product_id) => {
  try {
    for (const image of images) {
      const result = await DatabaseQuery.insert(
        client,
        {
          fields: ["product_id", "image_path"],
          table: "product_images",
        },
        [product_id, image]
      );
    }
  } catch (error) {
    throw error;
  }
};

const deleteImages = async (client, images, product_id) => {
  try {
    for (const elm of images) {
      const res = await DatabaseQuery.delete(client, {
        table: "product_images",
        where: { image_path: elm, product_id },
      });
    }
  } catch (error) {
    throw error;
  }
};

const getProductImage = async (pool, product_id) => {
  const result = await DatabaseQuery.select(pool, {
    fields: ["image_path"],
    table: "product_images",
    where: { product_id },
  });
  return result.rows;
};

const updateProductImages = async (client, product_id, product_images) => {
  try {
    // 1) get current product images
    const images = await getProductImage(client, product_id);
    const imagesMap = new Map();
    for (const image of images) {
      imagesMap.set(image.image_path, true);
    }
    // 2) select new product images
    const add = [];
    const remove = [];

    for (const elm of product_images) {
      if (imagesMap.has(elm) === false) {
        add.push(elm);
      } else {
        imagesMap.delete(elm);
      }
    }

    imagesMap.forEach((value, key) => {
      remove.push(key);
    });

    // Delete Product_images
    await deleteImages(client, remove, product_id);

    // Add new Product images
    await addImage(client, add, product_id);

    return remove;
  } catch (error) {
    throw error;
  }
};

exports.create = async (product) => {
  const client = await pool.connect();
  try {
    // start transaction
    await client.query("BEGIN");

    // 1) Insert product
    let obj = { ...product };
    delete obj["product_sub_categories"];
    delete obj["product_images"];
    const fieldsAndValue = DatabaseQuery.buildFieldsAndValues(obj);
    let newProduct = await DatabaseQuery.insert(
      client,
      {
        fields: fieldsAndValue[0],
        table: "products",
      },
      fieldsAndValue[1]
    );
    const product_id = newProduct.rows[0].product_id;

    // 2) Insert product_id , and subCategory_id into product_sub_categories table
    await addSubCategory(
      client,
      product.product_sub_categories,
      product_id,
      product.category_id
    );

    // 3) Insert product_id, and product_images into product_images table
    await addImage(client, product["product_images"], product_id);

    await client.query("COMMIT");
    newProduct.rows[0].subCategories = product.product_sub_categories;
    newProduct.rows[0].product_images = product.product_images;
    return newProduct.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    const images = [product["product_cover"], ...product["product_images"]];
    fileHandler.deleteFiles(images);
    throw error;
  } finally {
    await client.end();
  }
};

exports.find = async (config) => {
  try {
    const result = await DatabaseQuery.select(pool, {
      fields: config.fields,
      table: "products_view",
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
      table: "products_view",
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteById = async (product_id) => {
  try {
    const images = getProductImage(pool, product_id);

    let result = await DatabaseQuery.delete(pool, {
      table: "products",
      where: { product_id },
    });

    if (result.rows[0]) {
      result.rows[0].product_images = [];
      for (const image of images) {
        result.rows[0].product_images.push(image.image_path);
      }
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateById = async (product) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1) Update Product
    let obj = { ...product };

    delete obj["product_id"];
    delete obj["product_sub_categories"];
    delete obj["product_images"];
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(obj);
    let updatedProduct = await DatabaseQuery.update(
      client,
      {
        table: "products",
        where: { product_id: product.product_id },
        fields: fieldsAndValues[0],
      },
      fieldsAndValues[1]
    );

    if (updatedProduct.rowCount === 0) {
      return null;
    }
    if (product.product_sub_categories) {
      // 2) Update product_sub_categories table
      await updateSubCategories(
        client,
        updatedProduct.rows[0],
        product.product_sub_categories
      );
    }

    // 3) Update product images
    let oldImages = [];
    if (product.product_images) {
      oldImages = await updateProductImages(
        client,
        product.product_id,
        product.product_images
      );
    }
    await client.query("COMMIT");

    // delete old images form files
    fileHandler.deleteFiles(oldImages);

    updatedProduct.rows[0].subCategories = product.product_sub_categories;
    updatedProduct.rows[0].product_images = product.product_images;
    return updatedProduct.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    const images = [];
    if (product.product_cover) images.push(product.product_cover);
    if (product.product_images) images.push(...product.product_images);
    fileHandler.deleteFiles(images);
    throw error;
  } finally {
    await client.end();
  }
};
