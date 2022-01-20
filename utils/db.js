const format = require("pg-format");
const db = require("../db/connection");

exports.allItems = async (database) => {
  const { rows } = await db.query(format(`SELECT * FROM %I`, database));
  return rows;
};

exports.getCount = async (database, search = "%%") => {
  const { rows } = await db.query(
    format(`SELECT COUNT(*) FROM %I WHERE player_name iLIKE $1;`, database),
    [`%${search}%`]
  );

  return rows[0];
};

exports.checkPlayer = async (player_name) => {
  const { rows } = await db.query(
    `SELECT * FROM players WHERE player_name = $1`,
    [player_name]
  );

  return !rows.length;
};

exports.checkNote = async (id) => {
  const { rows } = await db.query(`SELECT * FROM notes WHERE note_id = $1`, [
    id,
  ]);

  return !rows.length;
};
