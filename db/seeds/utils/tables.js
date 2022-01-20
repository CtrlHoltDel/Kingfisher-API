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
        p_created_at TIMESTAMP DEFAULT NOW()
      );`;

  const notes = `CREATE TABLE notes(
            note_id SERIAL PRIMARY KEY,
            player_name VARCHAR NOT NULL REFERENCES players(player_name),
            n_created_at TIMESTAMP DEFAULT NOW(),
            note VARCHAR,
            n_created_by VARCHAR
          );`;

  const tendencies = `CREATE TABLE tendencies(
                tendency_id SERIAL PRIMARY KEY,
                player_name VARCHAR NOT NULL REFERENCES players(player_name),
                tendency VARCHAR,
                t_created_at TIMESTAMP DEFAULT NOW(),
                t_created_by VARCHAR
              );`;

  await db.query(players);
  await db.query(notes);
  await db.query(tendencies);
};

module.exports = { dropTables, createTables };
