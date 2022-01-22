const { generateCSV } = require("../utils/CSV");
const { allItems } = require("../utils/db");
const { writeFile } = require("fs/promises");

exports.fetchJSON = async () => {
  const players = await allItems("players");
  const notes = await allItems("notes");
  const tendencies = await allItems("tendencies");

  return { players, notes, tendencies };
};

exports.fetchCSV = async (file) => {
  const greenList = ["notes.csv", "players.csv", "tendencies.csv"];

  if (!greenList.includes(file))
    return Promise.reject({ status: 404, message: "invalid filename" });

  const data = await allItems(file.slice(0, -4));
  const csv = await generateCSV(file, data);

  await writeFile(`${__dirname.slice(0, -7)}/backup/${file}`, csv);
};
