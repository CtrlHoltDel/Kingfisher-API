const format = require("pg-format");
const db = require("../db/connection");

exports.allItems = async (database) => {
  const { rows } = await db.query(format(`SELECT * FROM %I`, database));
  return rows;
};
