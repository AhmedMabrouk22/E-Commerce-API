// // const this.pool = require("../config/db");

// class DatabaseQuery {
//   /**
//    * Prepare sql query
//    * @param fields array to specify select clause (must in select,insert).
//    * @param table string to specify table or view (must in all).
//    * @param where object to specify where clause (must in select,update,delete)
//    * Ex: {
//    * key1 : val1,
//    * key2 : {key2.1 : val2.1 , key2.2 : val2.2}
//    * }
//    * @param orderBy array to specify order by clause
//    * @param limit object to specify limit and offset
//    */
//   constructor({ fields, table, where, orderBy, limit }, pool) {
//     const _fields = fields;
//     const _table = table;
//     const _where = where;
//     const _orderBy = orderBy;
//     const _limit = limit;
//     this.pool = pool;
//     this.getDatabase = function () {
//       return {
//         fields: _fields,
//         table: _table,
//         where: _where,
//         orderBy: _orderBy,
//         limit: _limit,
//       };
//     };
//   }

//   #buildWhereClause = (filters, values) => {
//     const whereConditions = [];
//     if (filters) {
//       // { category_id: { '>=': '5', '<=': '20' }, category_name: 'cat 2' }
//       Object.entries(filters).forEach(([key, value]) => {
//         if (typeof value === "object") {
//           Object.entries(value).forEach(([operator, operand]) => {
//             // EX: category_id >= 5
//             whereConditions.push(`${key} ${operator} $${values.length + 1}`);
//             values.push(operand);
//           });
//         } else {
//           whereConditions.push(`${key} = $${values.length + 1}`);
//           values.push(value);
//         }
//       });
//     }
//     return whereConditions.length > 0
//       ? `WHERE ${whereConditions.join(" AND ")}`
//       : ``;
//   };

//   #buildOrderByClause = (sort) => {
//     if (sort) {
//       const orderBy = [];
//       sort.forEach((elm) => {
//         const col = elm.startsWith("-") ? elm.slice(1) : elm;
//         const type = elm.startsWith("-") ? "DESC" : "ASC";
//         orderBy.push(`${col} ${type}`);
//       });

//       return `ORDER BY ${orderBy.join(" , ")}`;
//     } else {
//       return ``;
//     }
//   };

//   #buildLimitClause = (paginate, values) => {
//     if (paginate) {
//       const clause = `LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
//       values.push(paginate.limit);
//       values.push(paginate.skip);
//       return clause;
//     }
//     return ``;
//   };

//   #buildQuery = (config, values) => {
//     const fields = config.fields ? [...config.fields] : "*";
//     const whereClause = this.#buildWhereClause(config.filter, values);
//     const orderBy = this.#buildOrderByClause(config.sort);
//     const paginate = this.#buildLimitClause(config.paginate, values);

//     return `SELECT ${fields}
//           FROM ${this.getDatabase().table}
//           ${whereClause}
//           ${orderBy}
//           ${paginate}`;
//   };

//   #isExist = (val) => {
//     val.forEach((elm) => {
//       if (!this.getDatabase()[elm]) {
//         throw new Error(`Invalid operation: ${elm} undefined`);
//       }
//     });
//   };

//   async insert(values) {
//     this.#isExist(["table", "fields"]);
//     try {
//       if (this.getDatabase().fields.length != values.length) {
//         throw new Error(
//           "Invalid operation : number of fields must be equal number of values"
//         );
//       }

//       const insertFields = this.getDatabase().fields.join(" , ");
//       const insertValues = [];
//       for (let i = 1; i <= values.length; ++i) {
//         insertValues.push(`$${i}`);
//       }
//       const query = `INSERT INTO ${this.getDatabase().table} (${insertFields})
//                     VALUES (${insertValues.join(" , ")}) RETURNING *`;
//       const result = await this.pool.query(query, values);
//       return result;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async select() {
//     this.#isExist(["table"]);
//     try {
//       const values = [];
//       const config = {
//         filter: this.getDatabase().where,
//         paginate: this.getDatabase().limit,
//         fields: this.getDatabase().fields,
//         sort: this.getDatabase().orderBy,
//       };
//       const query = this.#buildQuery(config, values);
//       const result = await this.pool.query(query, values);
//       return result;
//     } catch (error) {
//       throw error;
//     }
//   }

//   /**
//    * Run update query in sql
//    * @param {*} obj {key1 : value1, kay2 : value2}
//    * @returns
//    */
//   async update(obj) {
//     this.#isExist(["table"]);
//     try {
//       const setClause = [];
//       const values = [];
//       /*
//       {
//         key : value,
//         key : value
//       }
//     */
//       Object.entries(obj).forEach(([key, value]) => {
//         setClause.push(`${key} = $${values.length + 1}`);
//         values.push(value);
//       });
//       const whereClause = this.#buildWhereClause(
//         this.getDatabase().where,
//         values
//       );
//       const query = `UPDATE ${this.getDatabase().table}
//                     SET ${setClause.join(" , ")}
//                     ${whereClause} RETURNING *`;

//       const result = await this.pool.query(query, values);
//       return result;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async delete() {
//     this.#isExist(["table", "where"]);
//     try {
//       const values = [];
//       const whereClause = this.#buildWhereClause(
//         this.getDatabase().where,
//         values
//       );
//       const query = `DELETE FROM ${this.getDatabase().table} ${whereClause}`;
//       const result = await this.pool.query(query, values);
//       return result;
//     } catch (error) {
//       throw error;
//     }
//   }
// }

// module.exports = DatabaseQuery;

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

const buildQuery = (config, values) => {
  const fields = config.fields ? [...config.fields] : "*";
  const whereClause = buildWhereClause(config.where, values);
  const orderBy = buildOrderByClause(config.orderBy);
  const paginate = buildLimitClause(config.limit, values);

  return `SELECT ${fields}
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
  databaseConfig = { fields, table, where, orderBy, limit }
) => {
  isExist(["table"], databaseConfig);
  try {
    const values = [];

    const query = buildQuery(databaseConfig, values);
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
