const db = require("../../connection");
const format = require("pg-format");
const bcrypt = require("bcryptjs");

exports.fillTables = async (data) => {
  const { players, tendencies, notes, users, keys } = data;

  if (!players || !tendencies || !notes || !users || !keys) {
    console.log("Missing Data");
    return;
  }

  const usersQuery = format(
    `INSERT INTO users(username, password, admin, validated, u_created_at) VALUES %L`,
    users.map((user) => {
      return [
        user.username,
        user.password,
        user.admin,
        user.validated,
        user.u_created_at
      ];
    })
  );

  const playersQuery = format(
    "INSERT INTO players (player_name, type, p_created_at, aliases, p_created_by) VALUES %L",
    players.map((player) => {
      return [
        player.player_name,
        player.type,
        player.p_created_at
          ? new Date(player.p_created_at)
          : new Date(1642502115903),
        player.aliases,
        player.p_created_by,
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

  const keysQuery = format(
    `INSERT INTO keys (key, expiry_date, k_created_by) VALUES %L`,
    keys.map((key) => {
      return [key.key, key.expiry_date, key.k_created_by];
    })
  );

  await db.query(playersQuery);
  if (tendencies.length) await db.query(tendenciesQuery);
  if (notes.length) await db.query(notesQuery);
  if (users.length) await db.query(usersQuery);
  if (keys.length) await db.query(keysQuery);

  const { rows } = await db.query(
    `SELECT * FROM users WHERE username = '${process.env.ADMIN_USER}'`
  );

  if (!rows[0]) {
    console.log("Generating admin account")


    console.log(process.env.ADMIN_USER, "<< Admin user")



    console.log(process.env.ADMIN_PASSWORD, "<< Admin user")

    await db.query(
      `INSERT INTO users (username, password, admin, validated, u_created_at) VALUES ($1, $2, $3, $4, $5) RETURNING username, u_created_at`,
      [
        process.env.ADMIN_USER,
        await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
        true,
        true, 
        "2000-01-01T09:56:54.244Z",
      ]
    );

  }
};
