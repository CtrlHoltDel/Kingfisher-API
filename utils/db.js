const format = require("pg-format");
const db = require("../db/connection");

exports.allItems = async (database) => {
  const { rows } = await db.query(format(`SELECT * FROM %I`, database));
  return rows;
};

exports.getCount = async (database) => {
  const { rows } = await db.query(format(`SELECT COUNT(*) FROM %I;`, database));
  return rows[0];
};

exports.checkPlayer = async (player_name) => {
  const { rows } = await db.query(
    `SELECT * FROM players WHERE player_name = $1`,
    [player_name]
  );

  if (!rows.length)
    return Promise.reject({ status: 404, message: "Non-existent user" });
};
