const fs = require("fs/promises");
const { allItems } = require("./db");

exports.generateBackups = async () => {
  const players = await allItems("players");
  const notes = await allItems("notes");
  const tendencies = await allItems("tendencies");

  const playersCSVstring = players.reduce(
    (total, { player_name, type, created_at }) =>
      (total += `${player_name}, ${type},${created_at}\n`),
    `player_name, type, created_at\n`
  );

  const notesCSVstring = notes.reduce(
    (total, { note_id, player_name, created_by, created_at, note }) =>
      (total += `${note_id}, ${player_name}, ${created_by}, ${created_at}, ${note.replaceAll(
        ",",
        "  |||"
      )}\n`),
    `note_id, player_name, created_by, created_at, note\n`
  );

  const tendenciesCSVstring = tendencies.reduce(
    (total, { tendency_id, player_name, created_by, created_at, tendency }) =>
      (total += `${tendency_id}, ${player_name}, ${created_by}, ${created_at}, ${tendency.replaceAll(
        ",",
        "  |||"
      )}\n`),
    `tendency_id, player_name, created_by, created_at, tendency\n`
  );

  let allData = players.map((player) => {
    const filteredNotes = notes.filter(
      (note) => note.player_name === player.player_name
    );

    const filteredTendencies = tendencies.filter(
      (tendency) => tendency.player_name === player.player_name
    );

    return { ...player, notes: filteredNotes, tendencies: filteredTendencies };
  });

  const directory = `${__dirname.slice(0, -6)}`;

  await fs.rm(directory + "/backup", { recursive: true });
  await fs.mkdir(directory + "/backup");
  await fs.writeFile(directory + "/backup/players.csv", playersCSVstring);
  await fs.writeFile(directory + "/backup/notes.csv", notesCSVstring);
  await fs.writeFile(directory + "/backup/tendencies.csv", tendenciesCSVstring);
  await fs.writeFile(directory + "/backup/all.json", JSON.stringify(allData));
};
