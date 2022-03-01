const db = require("../db/connection");

exports.incrimentOnlineTime = async (username, amount) => {
  if (!username || !amount) {
    return;
  }

  console.log("incrimenting online time");

  await db.query(
    `UPDATE users SET total_time = total_time + $1 WHERE username = $2;`,
    [amount, username]
  );

  // const { rows } = await db.query(
  //   `UPDATE users SET last_seen = $1 WHERE username = $2;`,
  //   [new Date(), username]
  // );
};
