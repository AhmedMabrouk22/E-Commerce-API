const AppError = require("../utils/appError");
const pool = require("./../config/db");

const buildWhereClause = (filters, values) => {
  const whereConditions = [];
  // { category_id: { '>=': '5', '<=': '20' }, category_name: 'cat 2' }
  if (filters) {
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
  // id,cat_name,-price
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

const buildQuery = (config, values) => {
  const fields = config.fields ? [...config.fields] : "*";
  const whereClause = buildWhereClause(config.filter, values);
  const orderBy = buildOrderByClause(config.sort);
  const paginate = config.paginate
    ? `LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
    : ``;
  if (config.paginate) {
    values.push(config.paginate.limit);
    values.push(config.paginate.skip);
  }
  return `SELECT ${fields} 
          FROM categories_view
          ${whereClause}
          ${orderBy}
          ${paginate}`;
};

exports.create = async (category) => {
  try {
    const query = `INSERT INTO categories_view (category_name,category_slug,category_image) 
                  VALUES($1,$2,$3) RETURNING *`;
    const values = [
      category.category_name,
      category.category_slug,
      category.category_image,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.findById = async (config) => {
  try {
    const values = [];
    const query = buildQuery(config, values);
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.find = async (config) => {
  try {
    const values = [];
    const query = buildQuery(config, values);
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

exports.updateById = async (category) => {
  try {
    const query = `UPDATE categories_view 
                SET category_name = $1,
                    category_slug = $2
                WHERE category_id = $3 RETURNING *`;
    const values = [
      category.category_name,
      category.category_slug,
      category.category_id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
