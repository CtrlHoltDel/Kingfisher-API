const seed = require("./seed");
const db = require("../connection");
const { notes, tendencies, players } = require("../data");

const seedDb = () => {
  seed({ notes, tendencies, players }).then(() => {
    db.end();
  });
};

seedDb();
