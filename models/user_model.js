const pool = require("../config/db");
const DatabaseQuery = require("../utils/database");
const fileHandler = require("./../utils/file");

exports.signup = async (user) => {
  const client = await pool.connect();
  try {
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(user);
    await client.query("BEGIN");
    let newUser = await DatabaseQuery.insert(
      client,
      {
        table: "users",
        fields: fieldsAndValues[0],
      },
      fieldsAndValues[1]
    );

    const user_auth = await DatabaseQuery.insert(
      client,
      {
        fields: ["user_id"],
        table: "user_auth",
      },
      [newUser.rows[0].user_id]
    );
    await client.query("COMMIT");
    delete newUser.rows[0]["password"];
    delete newUser.rows[0]["active"];
    return newUser.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    if (user.profile_image) {
      fileHandler.deleteFile(user.profile_image);
    }
    throw error;
  } finally {
    await client.end();
  }
};

exports.findByEmail = async (email) => {
  try {
    const user = await DatabaseQuery.select(pool, {
      table: "users",
      where: { email },
    });

    return user.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.findByID = async (id) => {
  try {
    const user = await DatabaseQuery.select(pool, {
      table: "users",
      where: { user_id: id },
    });

    return user.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateUser = async (filter, user) => {
  try {
    const fieldsAndValues = DatabaseQuery(user);
    const newUser = await DatabaseQuery.update(
      pool,
      {
        fields: fieldsAndValues[0],
        table: "users",
        where: filter,
      },
      fieldsAndValues[1]
    );
    return newUser.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateUserPassword = async (filter, password) => {
  const client = await pool.connect();
  try {
    await client.query(`BEGIN`);
    const user = await DatabaseQuery.update(
      client,
      {
        fields: ["password"],
        table: "users",
        where: filter,
      },
      [password]
    );

    const time = Date.now() - 1000;
    await DatabaseQuery.update(
      client,
      {
        fields: ["password_changed_at"],
        table: "user_auth",
        where: { user_id: user.rows[0].user_id },
      },
      [time]
    );
    await client.query(`COMMIT`);

    return user.rows[0];
  } catch (error) {
    await client.query(`ROLLBACK`);
    throw error;
  }
};

exports.getUserAuth = async (filter) => {
  try {
    const user = await DatabaseQuery.select(pool, {
      table: "user_auth",
      where: filter,
    });

    return user.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateUserAuth = async (user_id, data) => {
  try {
    const fieldsAndValues = DatabaseQuery.buildFieldsAndValues(data);
    const user = await DatabaseQuery.update(
      pool,
      {
        fields: fieldsAndValues[0],
        table: "user_auth",
        where: { user_id },
      },
      fieldsAndValues[1]
    );
    return user.rows[0];
  } catch (error) {
    throw error;
  }
};
