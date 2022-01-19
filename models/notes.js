const db = require("../db/connection");
const { getCount, checkPlayer } = require("../utils/db");
const validation = require("../utils/validation");

exports.fetchNotes = async ({ limit = 10, p = 1 }) => {
  await validation.limitPage(limit, p);
  const { count } = await getCount("notes");

  const query = `SELECT * FROM notes
                 ORDER BY created_at DESC
                 LIMIT ${limit} OFFSET ${p * limit - limit}`;

  const { rows: notes } = await db.query(query);

  return { count: +count, notes };
};

exports.fetchNotesByPlayer = async ({ player }) => {
  await checkPlayer(player);
  const query = `SELECT note_id, created_at, note, created_by FROM notes
                 WHERE player_name = $1`;

  const { rows } = await db.query(query, [player]);

  return { notes: rows };
};
