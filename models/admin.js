const db = require("../db/connection");

exports.fetchUsers = async () => {
  const { rows } = await db.query(
    `SELECT * FROM users ORDER BY u_created_at DESC;`
  );

  return rows;
};

exports.amendUser = async ({ id }, { validated = false, admin = false }) => {
  console.log(validated, admin);
  const { rows: user } = await db.query(
    `UPDATE users SET validated = $2, admin = $3 WHERE user_id = $1 RETURNING username, admin, validated, user_id`,
    [id, validated, admin]
  );

  return user;
};

exports.removeUser = async ({ id }) => {
  await db.query(`DELETE FROM users WHERE user_id = $1`, [id]);
};
