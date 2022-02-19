const { generateCSV } = require("../utils/CSV");
const { allItems } = require("../utils/db");
const { writeFile } = require("fs/promises");

exports.fetchJSON = async () => {
  const players = await allItems("players");
  const notes = await allItems("notes");
  const tendencies = await allItems("tendencies");
  const users = await allItems("users");

  await writeFile(
    `${__dirname.slice(0, -7)}/backup/all.json`,
    JSON.stringify({
      players,
      notes,
      tendencies,
      users,
    })
  );
};

exports.fetchCSV = async () => {
  const players = await allItems("players");
  const notes = await allItems("notes");
  const tendencies = await allItems("tendencies");
  const csv = await generateCSV(players, notes, tendencies);

  await writeFile(`${__dirname.slice(0, -7)}/backup/all.csv`, csv);
};
