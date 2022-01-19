const db = require("../db/connection");
const { getCount } = require("../utils/db");
const validation = require("../utils/validation");

exports.fetchPlayers = async ({ limit = 10, p = 1 }) => {
  await validation.limitPage(limit, p);
  const { count } = await getCount("players");

  const query = `SELECT * FROM players
                 ORDER BY created_at DESC
                 LIMIT ${limit} OFFSET ${p * limit - limit};
                `;

  const { rows: players } = await db.query(query);

  return { count: +count, players };
};
