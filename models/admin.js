const db = require("../db/connection");

exports.fetchUsers = async () => {
  const { rows } = await db.query(
    `SELECT * FROM users ORDER BY u_created_at DESC;`
  );

  return rows;
};

exports.amendUser = async ({ id }, { validated = false, admin = false }) => {
  const { rows: user } = await db.query(
    `UPDATE users SET validated = $2, admin = $3 WHERE user_id = $1 RETURNING username, admin, validated, user_id`,
    [id, validated, admin]
  );

  return user;
};

exports.removeUser = async ({ id }) => {
  await db.query(`DELETE FROM users WHERE user_id = $1`, [id]);
};

exports.fetchRecent = async () => {
  const { rows: notes } = await db.query(
    `SELECT * FROM notes ORDER BY n_created_at DESC LIMIT 5`
  );

  const { rows: tendencies } = await db.query(
    `SELECT * FROM tendencies ORDER BY t_created_at DESC LIMIT 5`
  );

  const { rows: note_count } = await db.query(
    `SELECT COUNT(note_id) :: INT FROM notes;`
  );

  const { rows: tendency_count } = await db.query(
    `SELECT COUNT(tendency_id):: INT FROM tendencies;`
  );

  const { rows: player_count } = await db.query(
    `SELECT COUNT(player_name) :: INT FROM players;`
  );

  const { rows: user_count } = await db.query(
    `SELECT COUNT(user_id) :: INT FROM users;`
  );

  return {
    notes,
    tendencies,
    note_count: note_count[0],
    tendency_count: tendency_count[0],
    player_count: player_count[0],
    user_count: user_count[0],
  };
};
