const buildWhereClause = (filters, values) => {
  const whereConditions = [];
  if (filters) {
    // { category_id: { '>=': '5', '<=': '20' }, category_name: 'cat 2' }
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === "object") {
        Object.entries(value).forEach(([operator, operand]) => {
          // EX: category_id >= 5
          whereConditions.push(`${key} ${operator} $${values.length + 1}`);
          values.push(operand);
        });
      } else {
        whereConditions.push(`${key} = $${values.length + 1}`);
        values.push(value);
      }
    });
  }
  return whereConditions.length > 0
    ? `WHERE ${whereConditions.join(" AND ")}`
    : ``;
};

const buildOrderByClause = (sort) => {
  if (sort) {
    const orderBy = [];
    sort.forEach((elm) => {
      const col = elm.startsWith("-") ? elm.slice(1) : elm;
      const type = elm.startsWith("-") ? "DESC" : "ASC";
      orderBy.push(`${col} ${type}`);
    });

    return `ORDER BY ${orderBy.join(" , ")}`;
  } else {
    return ``;
  }
};

const buildLimitClause = (paginate, values) => {
  if (paginate) {
    const clause = `LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(paginate.limit);
    values.push(paginate.skip);
    return clause;
  }
  return ``;
};

const buildQuery = (config, values, options) => {
  const fields = config.fields ? [...config.fields] : "*";
  const whereClause = buildWhereClause(config.where, values);
  const orderBy = buildOrderByClause(config.orderBy);
  const paginate = buildLimitClause(config.limit, values);

  const distinct = options.distinct === true ? `DISTINCT ` : ``;
  return `SELECT ${distinct}${fields}
          FROM ${config.table}
          ${whereClause}
          ${orderBy}
          ${paginate}`;
};

const isExist = (val, databaseConfig) => {
  val.forEach((elm) => {
    if (!databaseConfig[elm]) {
      throw new Error(`Invalid operation: ${elm} undefined`);
    }
  });
};

exports.insert = async (
  pool,
  databaseConfig = { fields, table, where, orderBy, limit },
  values
) => {
  isExist(["table", "fields"], databaseConfig);
  try {
    if (databaseConfig.fields.length != values.length) {
      throw new Error(
        "Invalid operation : number of fields must be equal number of values"
      );
    }
    const insertFields = databaseConfig.fields.join(" , ");
    const insertValues = [];
    for (let i = 1; i <= values.length; ++i) {
      insertValues.push(`$${i}`);
    }
    const query = `INSERT INTO ${databaseConfig.table} (${insertFields})
                        VALUES (${insertValues.join(" , ")}) RETURNING *`;
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.select = async (
  pool,
  databaseConfig = { fields, table, where, orderBy, limit },
  options = { distinct: false }
) => {
  isExist(["table"], databaseConfig);
  try {
    const values = [];

    const query = buildQuery(databaseConfig, values, options);
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.update = async (
  pool,
  databaseConfig = { fields, table, where, orderBy, limit },
  values
) => {
  isExist(["table", "fields", "where"], databaseConfig);
  try {
    if (databaseConfig.fields.length != values.length) {
      throw new Error(
        "Invalid operation : number of fields must be equal number of values"
      );
    }
    const setClause = [];

    for (let i = 0; i < values.length; ++i) {
      setClause.push(`${databaseConfig.fields[i]} = $${i + 1}`);
    }

    const whereClause = buildWhereClause(databaseConfig.where, values);
    const query = `UPDATE ${databaseConfig.table}
                    SET ${setClause.join(" , ")}
                    ${whereClause} RETURNING *`;

    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.delete = async (
  pool,
  databaseConfig = { fields, table, where, orderBy, limit }
) => {
  isExist(["table", "where"], databaseConfig);
  try {
    const values = [];
    const whereClause = buildWhereClause(databaseConfig.where, values);
    const query = `DELETE FROM ${databaseConfig.table} ${whereClause}`;
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.buildFieldsAndValues = (obj) => {
  const fields = [];
  const values = [];

  Object.entries(obj).forEach(([key, val]) => {
    if (key) {
      fields.push(`${key}`);
      values.push(val);
    }
  });

  if (fields.length != values.length) {
    return null;
  }

  return [fields, values];
};
