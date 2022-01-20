const db = require("../db/connection");
const { getCount, checkPlayer, checkNote } = require("../utils/db");
const validation = require("../utils/validation");

exports.fetchNotes = async ({ limit = 10, p = 1 }) => {
  await validation.limitPage(limit, p);
  const { count } = await getCount("notes");

  const query = `SELECT * FROM notes
  ORDER BY n_created_at DESC
  LIMIT ${limit} OFFSET ${p * limit - limit}`;

  const { rows: notes } = await db.query(query);

  return { count: +count, notes };
};

exports.fetchNotesByPlayer = async ({ player }) => {
  if (await checkPlayer(player))
    return Promise.reject({ status: 404, message: "Non-existent user" });

  const query = `SELECT note_id, n_created_at, note, n_created_by FROM notes
  WHERE player_name = $1`;

  const { rows } = await db.query(query, [player]);

  return { notes: rows };
};

exports.insertNote = async ({ created_by, note }, { player }) => {
  if (await checkPlayer(player))
    return Promise.reject({ status: 404, message: "Non-existent user" });

  if (!created_by || !note)
    return Promise.reject({ status: 400, message: "Invalid body" });

  const query = `INSERT INTO notes(player_name, note, n_created_by) VALUES($1, $2, $3) RETURNING *`;

  const { rows } = await db.query(query, [player, note, created_by]);

  return rows[0];
};

exports.removeNote = async ({ id }) => {
  await validation.id(id);
  if (await checkNote(id))
    return Promise.reject({ status: 404, message: "Non-existent note" });

  const query = `DELETE FROM notes WHERE note_id = $1`;
  await db.query(query, [id]);
};
