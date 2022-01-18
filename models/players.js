const db = require("../db/connection");

exports.fetchPlayers = async ({ limit = 10, p = 1 }) => {
  if (!Number(limit) || !Number(p))
    return Promise.reject({ status: 404, message: "invalid query" });

  const { rows } = await db.query(`SELECT * FROM players`);

  return rows;
};
