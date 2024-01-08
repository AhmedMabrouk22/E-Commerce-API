const pool = require("./../config/db");
const DatabaseQuery = require("../utils/database");

exports.create = async (coupon) => {
  try {
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(coupon);

    const result = await DatabaseQuery.insert(
      pool,
      {
        table: "coupons",
        fields: fieldsAndValues[0],
      },
      fieldsAndValues[1]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateById = async (coupon) => {
  try {
    let obj = { ...coupon };
    delete obj.coupon_code;
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(obj); // [fields,values]
    if (!fieldsAndValues) {
      throw new Error(`something wrong in fieldsAndValues`);
    }

    const result = await DatabaseQuery.update(
      pool,
      {
        table: "coupons",
        where: { coupon_code: coupon.coupon_code },
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
      table: "coupons",
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
      table: "coupons",
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteById = async (coupon_code) => {
  try {
    const result = await DatabaseQuery.delete(pool, {
      table: "coupons",
      where: { coupon_code },
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
