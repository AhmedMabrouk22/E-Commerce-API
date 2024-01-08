const pool = require("./../config/db");
const DatabaseQuery = require("./../utils/database");

exports.getCart = async (user_id) => {
  try {
    const result = await DatabaseQuery.select(pool, {
      table: "shopping_carts",
      where: { user_id },
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.getCartItems = async (cart_id) => {
  try {
    const result = await DatabaseQuery.select(pool, {
      table: "cart_items",
      where: { cart_id },
    });
    return result.rows;
  } catch (error) {
    throw error;
  }
};

exports.addProduct = async (cart) => {
  try {
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(cart);
    const result = await DatabaseQuery.insert(
      pool,
      {
        table: "cart_items",
        fields: fieldsAndValues[0],
      },
      fieldsAndValues[1]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateProduct = async (cart) => {
  try {
    const obj = { ...cart };
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(obj);
    const result = await DatabaseQuery.update(
      pool,
      {
        table: "cart_items",
        fields: fieldsAndValues[0],
        where: { cart_id: cart.cart_id, product_id: cart.product_id },
      },
      fieldsAndValues[1]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteProduct = async (cart_id, product_id) => {
  try {
    const result = await DatabaseQuery.delete(pool, {
      table: "cart_items",
      where: { cart_id, product_id },
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.clearCart = async (cart_id) => {
  try {
    const result = await DatabaseQuery.delete(pool, {
      table: "cart_items",
      where: { cart_id },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getCartItemsInDetails = async (config) => {
  try {
    const result = await DatabaseQuery.select(pool, {
      fields: config.fields,
      table: "shopping_cart_view",
      where: config.filter,
      orderBy: config.sort,
      limit: config.paginate,
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateShoppingCart = async (shopping) => {
  try {
    const obj = { ...shopping };
    delete obj["cart_id"];
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(obj);
    const result = await DatabaseQuery.update(
      pool,
      {
        table: "shopping_carts",
        fields: fieldsAndValues[0],
        where: { cart_id: shopping.cart_id },
      },
      fieldsAndValues[1]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
