const db = require("../../connection");
const format = require("pg-format");

exports.fillTables = async (data) => {
  const { players, tendencies, notes } = data;

  if (!players || !tendencies || !notes) {
    console.log("Missing Data");
  }

  const playersQuery = format(
    "INSERT INTO players (player_name, type, p_created_at) VALUES %L",
    players.players.map((player) => {
      return [
        player.name,
        player.type,
        player.created_at ? player.created_at : new Date(1642502115903),
      ];
    })
  );

  const tendenciesQuery = format(
    `INSERT INTO tendencies (player_name, tendency, t_created_by, t_created_at) VALUES %L`,
    tendencies.tendencies.map((tendency) => {
      return [
        tendency.player,
        tendency.tendency,
        tendency.created_by,
        new Date(1642502115903),
      ];
    })
  );

  const notesQuery = format(
    `INSERT INTO notes (player_name, note, n_created_by, n_created_at) VALUES %L`,
    notes.notes.map((note) => {
      return [note.player, note.note, note.created_by, new Date(1642502115903)];
    })
  );

  await db.query(playersQuery);
  await db.query(tendenciesQuery);
  await db.query(notesQuery);
};
