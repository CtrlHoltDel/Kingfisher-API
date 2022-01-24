const seed = require("./seed");
const db = require("../connection");
const fs = require("fs/promises");

const seedDb = async () => {
  const data = await fs.readFile(`${__dirname.slice(0, -6)}/data/data.json`);
  await seed(JSON.parse(data));
  db.end();
};

seedDb();
