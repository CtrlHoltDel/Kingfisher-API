const db = require("../../connection");
const format = require("pg-format");
const bcrypt = require("bcryptjs");

exports.fillTables = async (data) => {
  const { players, tendencies, notes, users } = data;

  if (!players || !tendencies || !notes || !users) {
    console.log("Missing Data");
  }

  const usersQuery = format(
    `INSERT INTO users(username, password, admin, validated, u_created_at) VALUES %L`,
    users.map((user) => {
      return [
        user.username,
        user.password,
        user.admin,
        user.validated,
        user.u_created_at,
      ];
    })
  );

  await db.query(
    `INSERT INTO users (username, password, admin) VALUES ($1, $2, $3) RETURNING username, u_created_at`,
    ["admin", await bcrypt.hash("admin", 10), true]
  );

  const playersQuery = format(
    "INSERT INTO players (player_name, type, p_created_at, aliases) VALUES %L",
    players.map((player) => {
      return [
        player.player_name,
        player.type,
        player.p_created_at
          ? new Date(player.p_created_at)
          : new Date(1642502115903),
        player.aliases,
      ];
    })
  );

  const tendenciesQuery = format(
    `INSERT INTO tendencies (player_name, tendency, t_created_by, t_created_at) VALUES %L`,
    tendencies.map((tendency) => {
      return [
        tendency.player_name,
        tendency.tendency,
        tendency.t_created_by,
        tendency.t_created_at && tendency.t_created_at !== "unknown"
          ? new Date(tendency.t_created_at)
          : new Date(1642502115903),
      ];
    })
  );

  const notesQuery = format(
    `INSERT INTO notes (player_name, note, n_created_by, n_created_at) VALUES %L`,
    notes.map((note) => {
      return [
        note.player_name,
        note.note,
        note.n_created_by,
        note.n_created_at
          ? new Date(note.n_created_at)
          : new Date(1642502115903),
      ];
    })
  );

  await db.query(playersQuery);
  if (tendencies.length) await db.query(tendenciesQuery);
  if (notes.length) await db.query(notesQuery);
  if (users.length) await db.query(usersQuery);
};
