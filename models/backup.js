const { generateCSV } = require("../utils/CSV");
const { allItems } = require("../utils/db");
const { writeFile } = require("fs/promises");
const db = require("../db/connection");
const { isAfter } = require("date-fns");

exports.fetchJSON = async (backupKey) => {
  const { rows } = await db.query("SELECT * FROM keys WHERE key = $1", [
    backupKey,
  ]);

  if (!rows[0] || isAfter(Date.now(), rows[0].expiry_date)) {
    return Promise.reject({ status: 403, error: "Invalid or expired key" });
  }

  const players = await allItems("players");
  const notes = await allItems("notes");
  const tendencies = await allItems("tendencies");
  const users = await allItems("users");
  const keys = await allItems("keys");
  const logs = await allItems("logs");

  await writeFile(
    `${__dirname.slice(0, -7)}/backup/all.json`,
    JSON.stringify({ players, notes, tendencies, users, keys, logs })
  );
};

exports.fetchCSV = async () => {
  const players = await allItems("players");
  const notes = await allItems("notes");
  const tendencies = await allItems("tendencies");
  const csv = await generateCSV(players, notes, tendencies);

  await writeFile(`${__dirname.slice(0, -7)}/backup/all.csv`, csv);
};
