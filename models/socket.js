const db = require("../db/connection");

exports.incrimentOnlineTime = async (username, amount) => {
  if (!username || !amount) {
    return;
  }

  const { rows } = await db.query(
    `UPDATE users SET total_time = total_time + $1 WHERE username = $2 RETURNING *;`,
    [amount, username]
  );

  return rows;
};
