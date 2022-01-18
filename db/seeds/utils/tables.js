const db = require("../../connection");

const dropTables = async () => {
  const tables = ["notes", "tendencies", "players"];
  for (let i = 0; i < tables.length; i++) {
    await db.query(`DROP TABLE IF EXISTS ${tables[i]}`);
  }
};

const createTables = async () => {
  const players = `CREATE TABLE players (
        player_id SERIAL PRIMARY KEY,
        player_name VARCHAR(100),
        type VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
        );`;

  const notes = `CREATE TABLE notes(
            note_id SERIAL PRIMARY KEY, 
            player_id INT NOT NULL REFERENCES players(player_id),
            created_at TIMESTAMP DEFAULT NOW()
            );`;

  const tendencies = `CREATE TABLE tendencies(
                player_id INT NOT NULL REFERENCES players(player_id),
                tendencies VARCHAR
                );`;

  const tables = [players, notes, tendencies];
  for (let i = 0; i < tables.length; i++) {
    await db.query(tables[i]);
  }
};

module.exports = { dropTables, createTables };
