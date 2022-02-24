const { add } = require("date-fns");
const db = require("../db/connection");

exports.fetchUsers = async () => {
  const { rows } = await db.query(
    `SELECT * FROM users ORDER BY u_created_at DESC;`
  );

  return rows;
};

exports.amendUser = async ({ id }, { validated = false, admin = false }) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE user_id = $1`, [
    id,
  ]);

  if (rows[0].username === "ctrlholtdel" || rows[0].username === "admin")
    return;

  const { rows: user } = await db.query(
    `UPDATE users SET validated = $2, admin = $3 WHERE user_id = $1 RETURNING username, admin, validated, user_id`,
    [id, validated, admin]
  );

  return user;
};

exports.removeUser = async ({ id }) => {
  await db.query(`DELETE FROM users WHERE user_id = $1`, [id]);
};

const getCount = async (row, dataBase) => {
  return await db.query(`SELECT COUNT(${row}) from ${dataBase}`);
};

exports.fetchRecent = async () => {
  const { rows: notes } = await db.query(
    `SELECT * FROM notes ORDER BY n_created_at DESC LIMIT 5`
  );
  const { rows: tendencies } = await db.query(
    `SELECT * FROM tendencies ORDER BY t_created_at DESC LIMIT 5`
  );

  const { rows: note_count } = await getCount("note_id", "notes");
  const { rows: tendency_count } = await getCount("tendency_id", "tendencies");
  const { rows: player_count } = await getCount("player_name", "players");
  const { rows: user_count } = await getCount("user_id", "users");

  return {
    notes,
    tendencies,
    note_count: note_count[0],
    tendency_count: tendency_count[0],
    player_count: player_count[0],
    user_count: user_count[0],
  };
};

exports.createKey = async ({ username }) => {
  const key = `${Math.random()}`.replace(".", "");
  const expiryDate = add(new Date(), { seconds: 20 });

  const { rows } = await db.query(
    `INSERT INTO keys (key, expiry_date, k_created_by) VALUES ($1, $2, $3) returning *`,
    [key, expiryDate, username]
  );

  return rows[0];
};
