const fs = require("fs/promises");
const db = require("../connection");
const seed = require("./seed");

const updateDb = async () => {
  const data = await fs.readFile(
    `${__dirname.slice(0, -6)}/data/backup/backup.json`
  );
  await seed(JSON.parse(data));
  db.end();
};

updateDb();
