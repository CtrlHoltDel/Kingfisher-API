const bcrypt = require("bcryptjs");
const db = require("../db/connection");

exports.handleRegister = async (username, password) => {
  const { rows: userCheck } = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );

  if (userCheck[0]) {
    return Promise.reject({
      status: 400,
      message: "User with that name already exists ",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { rows } = await db.query(
    `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username, u_created_at`,
    [username, hashedPassword]
  );

  return rows;
};
