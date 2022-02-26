const db = require("../../connection");

const dropTables = async () => {
  const tables = ["notes", "tendencies", "players", "keys", "users", "logs"];
  for (let i = 0; i < tables.length; i++) {
    await db.query(`DROP TABLE IF EXISTS ${tables[i]}`);
  }
};

const createTables = async () => {
  const players = `CREATE TABLE players (
        player_name VARCHAR(255) PRIMARY KEY,
        type VARCHAR,
        p_created_at TIMESTAMP DEFAULT NOW(),
        p_created_by VARCHAR(255),
        aliases VARCHAR DEFAULT null
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

  const users = `CREATE TABLE users(
      user_id SERIAL PRIMARY KEY,
      username VARCHAR NOT NULL UNIQUE, 
      password VARCHAR NOT NULL,
      admin BOOLEAN DEFAULT FALSE,
      validated BOOLEAN DEFAULT TRUE,
      u_created_at TIMESTAMP DEFAULT NOW(),
      total_time INT DEFAULT 0
  )`;

  const keys = `CREATE TABLE keys(
    key_id SERIAL PRIMARY KEY, 
    key VARCHAR NOT NULL,
    expiry_date TIMESTAMP NOT NULL, 
    k_created_by VARCHAR NOT NULL REFERENCES users(username)
  )`;

  // const logs = `CREATE TABLE logs(
  //   log_id SERIAL PRIMARY KEY,
  //   method VARCHAR NOT NULL,
  //   username VARCHAR NOT NULL,
  //   message VARCHAR,
  //   time TIMESTAMP DEFAULT NOW(),
  //   player VARCHAR
  // )`;

  await db.query(players);
  await db.query(notes);
  await db.query(tendencies);
  await db.query(users);
  await db.query(keys);
  // await db.query(logs);
};

module.exports = { dropTables, createTables };
