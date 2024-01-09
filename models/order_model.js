const pool = require("./../config/db");
const DatabaseQuery = require("./../utils/database");

exports.createOrder = async (order) => {
  const client = await pool.connect();
  try {
    /*
        user_id
        cart_id
        payment_method
        is_paid
        paid_at
    */
    await client.query("BEGIN");
    const obj = { ...order };
    delete obj["cart_id"];
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(obj);

    // create new order
    const newOrder = await DatabaseQuery.insert(
      client,
      {
        table: "orders",
        fields: fieldsAndValues[0],
      },
      fieldsAndValues[1]
    );

    const cart_id = order.cart_id;
    const order_id = newOrder.rows[0].order_id;

    // get cart_items
    const products = await DatabaseQuery.select(client, {
      table: "cart_items",
      fields: ["product_id", "quantity"],
      where: { cart_id },
    });

    // move items from cart_items to order_items
    for (const product of products.rows) {
      const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(product);
      await DatabaseQuery.insert(
        client,
        {
          fields: ["order_id", ...fieldsAndValues[0]],
          table: "order_items",
        },
        [order_id, ...fieldsAndValues[1]]
      );
    }

    await client.query("COMMIT");
    return newOrder.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

exports.findOrder = async (order_id) => {
  try {
    const order = await DatabaseQuery.select(pool, {
      table: "orders",
      where: { order_id },
    });
    return order.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.find = async (config) => {
  try {
    const result = await DatabaseQuery.select(pool, {
      fields: config.fields,
      table: "order_view",
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
      table: "order_view",
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateOrder = async (order) => {
  try {
    let obj = { ...order };
    delete obj["order_id"];
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(obj);
    const newOrder = await DatabaseQuery.update(
      pool,
      {
        table: "orders",
        fields: fieldsAndValues[0],
        where: { order_id: order.order_id },
      },
      fieldsAndValues[1]
    );
    return newOrder.rows[0];
  } catch (error) {
    throw error;
  }
};
