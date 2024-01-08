const AppError = require("../utils/appError");
const pool = require("./../config/db");
const DatabaseQuery = require("./../utils/database");

const calcAverageRatingsAndRatingsNumbers = async (client, product_id) => {
  try {
    const query = `SELECT AVG(rating), COUNT(review_id)
                   FROM reviews
                   WHERE product_id = $1`;
    const values = [product_id];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const updateProductAverage = async (client, avg, count, product_id) => {
  try {
    const product = await DatabaseQuery.update(
      client,
      {
        table: "products",
        fields: ["ratings_average", "ratings_number"],
        where: { product_id },
      },
      [avg, count]
    );

    if (product.rowCount === 0) {
      throw new AppError(
        `something error, product with id ${result.rows[0].product_id} not found`,
        500
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.create = async (review) => {
  const client = await pool.connect();
  try {
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(review);
    await client.query(`BEGIN`);
    const result = await DatabaseQuery.insert(
      client,
      {
        table: "reviews",
        fields: fieldsAndValues[0],
      },
      fieldsAndValues[1]
    );

    if (result.rowCount) {
      const res = await calcAverageRatingsAndRatingsNumbers(
        client,
        result.rows[0].product_id
      );
      await updateProductAverage(
        client,
        res.avg,
        res.count,
        result.rows[0].product_id
      );
    }

    await client.query(`COMMIT`);
    return result.rows[0];
  } catch (error) {
    await client.query(`ROLLBACK`);
    throw error;
  } finally {
    client.release();
  }
};

exports.findById = async (config) => {
  try {
    const result = await DatabaseQuery.select(pool, {
      table: "reviews",
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
      table: "reviews",
      where: config.filter,
      orderBy: config.sort,
      limit: config.paginate,
    });

    return result.rows;
  } catch (error) {
    throw error;
  }
};

exports.updateById = async (review) => {
  const client = await pool.connect();
  try {
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(review);
    await client.query(`BEGIN`);
    const result = await DatabaseQuery.update(
      client,
      {
        table: "reviews",
        where: { review_id: review.review_id, user_id: review.user_id },
        fields: fieldsAndValues[0],
      },
      fieldsAndValues[1]
    );

    if (result.rowCount) {
      const res = await calcAverageRatingsAndRatingsNumbers(
        client,
        result.rows[0].product_id
      );
      await updateProductAverage(
        client,
        res.avg,
        res.count,
        result.rows[0].product_id
      );
    }

    await client.query(`COMMIT`);
    return result.rows[0];
  } catch (error) {
    await client.query(`ROLLBACK`);
    throw error;
  } finally {
    client.release();
  }
};

exports.deleteById = async (review_id, user_id) => {
  const client = await pool.connect();
  try {
    await client.query(`BEGIN`);
    let where = { review_id };
    if (user_id) where.user_id = user_id;
    const result = await DatabaseQuery.delete(client, {
      table: "reviews",
      where,
    });

    if (result.rowCount) {
      const res = await calcAverageRatingsAndRatingsNumbers(
        client,
        result.rows[0].product_id
      );
      await updateProductAverage(
        client,
        res.avg,
        res.count,
        result.rows[0].product_id
      );
    }
    await client.query(`COMMIT`);
    return result.rows[0];
  } catch (error) {
    await client.query(`ROLLBACK`);
    throw error;
  } finally {
    client.release();
  }
};
