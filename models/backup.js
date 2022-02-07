const { generateCSV } = require("../utils/CSV");
const { allItems } = require("../utils/db");
const { writeFile } = require("fs/promises");

exports.fetchJSON = async () => {
  const players = await allItems("players");
  const notes = await allItems("notes");
  const tendencies = await allItems("tendencies");

  return { players, notes, tendencies };
};

exports.fetchCSV = async () => {
  const players = await allItems("players");
  const notes = await allItems("notes");
  const tendencies = await allItems("tendencies");
  const csv = await generateCSV(players, notes, tendencies);

  await writeFile(`${__dirname.slice(0, -7)}/backup/all.csv`, csv);
};
