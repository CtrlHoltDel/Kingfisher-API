const db = require("../../connection");

const dropTables = async () => {
  const tables = ["notes", "tendencies", "players"];
  for (let i = 0; i < tables.length; i++) {
    await db.query(`DROP TABLE IF EXISTS ${tables[i]}`);
  }
};

const createTables = async () => {
  const players = `CREATE TABLE players (
        player_name VARCHAR(100) PRIMARY KEY,
        type VARCHAR,
        created_at TIMESTAMP DEFAULT NOW()
      );`;

  const notes = `CREATE TABLE notes(
            note_id SERIAL PRIMARY KEY,
            player_name VARCHAR NOT NULL REFERENCES players(player_name),
            created_at TIMESTAMP DEFAULT NOW(),
            note VARCHAR,
            created_by VARCHAR
          );`;

  const tendencies = `CREATE TABLE tendencies(
                player_name VARCHAR NOT NULL REFERENCES players(player_name),
                tendency VARCHAR,
                created_at TIMESTAMP DEFAULT NOW(),
                created_by VARCHAR
              );`;

  await db.query(players);
  await db.query(notes);
  await db.query(tendencies);
};

module.exports = { dropTables, createTables };
