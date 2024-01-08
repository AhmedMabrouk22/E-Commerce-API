const pool = require("./../config/db");
const DatabaseQuery = require("../utils/database");

exports.create = async (address) => {
  try {
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(address);

    const result = await DatabaseQuery.insert(
      pool,
      {
        table: "user_address",
        fields: fieldsAndValues[0],
      },
      fieldsAndValues[1]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateById = async (address) => {
  try {
    let obj = { ...address };
    delete obj.address_id;
    delete obj.user_id;
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(obj); // [fields,values]
    if (!fieldsAndValues) {
      throw new Error(`something wrong in fieldsAndValues`);
    }

    const result = await DatabaseQuery.update(
      pool,
      {
        table: "user_address",
        where: { address_id: address.address_id, user_id: address.user_id },
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
      table: "user_address",
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
      table: "user_address",
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteById = async (address_id, user_id) => {
  try {
    const result = await DatabaseQuery.delete(pool, {
      table: "user_address",
      where: { address_id: address_id, user_id },
    });
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
