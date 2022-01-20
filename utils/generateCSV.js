const db = require("../db/connection");
const { allItems } = require("./db");

exports.generateCSV = async () => {
  const players = await allItems("players");
  const notes = await allItems("notes");
  const tendencies = await allItems("tendencies");

  const playersCSV = players.reduce(
    (total, { player_name, type, p_created_at }) => {
      return (total += `${player_name}, ${type}, ${p_created_at}\n`);
    },
    "player_name, type, p_created_at\n"
  );

  const notesCSV = notes.reduce(
    (total, { note_id, player_name, n_created_at, n_created_by, note }) => {
      return (total += `${note_id}, ${player_name}, ${n_created_at}, ${n_created_by}, ${note}\n`);
    },
    "note_id, played_name, n_created_at, n_created_by, note\n"
  );

  const tendenciesCSV = tendencies.reduce(
    (
      total,
      { tendency_id, player_name, tendency, t_created_at, t_created_by }
    ) => {
      return (total += `${tendency_id}, ${player_name}, ${t_created_at}, ${t_created_by}, ${tendency}\n`);
    },
    "tendency_id, player_name, tendency, t_created_at, t_created_by\n"
  );

  return { playersCSV, notesCSV, tendenciesCSV };
};
