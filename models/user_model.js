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
      fields: ["email"],
      table: "users",
      where: { email },
    });

    return user.rows[0];
  } catch (error) {
    throw error;
  }
};
