exports.generateCSV = async (type, data) => {
  if (type === "players.csv") {
    return data.reduce((total, { player_name, type, p_created_at }) => {
      return (total += `${player_name}, ${type}, ${p_created_at}\n`);
    }, "player_name, type, p_created_at\n");
  }

  if (type === "notes.csv") {
    return data.reduce(
      (total, { note_id, player_name, n_created_at, n_created_by, note }) => {
        return (total += `${note_id}, ${player_name}, ${n_created_at}, ${n_created_by}, ${note}\n`);
      },
      "note_id, player_name, n_created_at, n_created_by, note\n"
    );
  }

  if (type === "tendencies.csv") {
    return data.reduce(
      (
        total,
        { tendency_id, player_name, tendency, t_created_at, t_created_by }
      ) => {
        return (total += `${tendency_id}, ${player_name}, ${t_created_at}, ${t_created_by}, ${tendency}\n`);
      },
      "tendency_id, player_name, t_created_at, t_created_by, tendency\n"
    );
  }
};
