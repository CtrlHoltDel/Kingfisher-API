const fs = require("fs/promises");
const db = require("../connection");
const seed = require("../seeds/seed");

const updateDb = async () => {
  const notes = await fs.readFile(`${__dirname}/json/notes.json`);
  const players = await fs.readFile(`${__dirname}/json/players.json`);
  const tendencies = await fs.readFile(`${__dirname}/json/tendencies.json`);

  await seed(
    {
      notes: JSON.parse(notes),
      players: JSON.parse(players),
      tendencies: JSON.parse(tendencies),
    },
    true
  );

  db.end();
};

updateDb();
