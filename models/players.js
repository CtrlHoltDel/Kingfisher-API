const { rows } = require("pg/lib/defaults");
const db = require("../db/connection");
const { getCount, checkPlayer } = require("../utils/db");
const validation = require("../utils/validation");

exports.fetchPlayers = async ({ limit = 10, p = 1, search = "%%" }) => {
  await validation.limitPage(limit, p);
  const { count } = await getCount("players", search);
  const exactQuery = `SELECT * FROM players WHERE player_name iLIKE $1`;

  let exactMatch;

  if (search !== "%%") {
    const { rows } = await db.query(exactQuery, [search]);
    exactMatch = rows;
  }

  const query = `SELECT * FROM players
                 WHERE player_name iLIKE $1
                 ORDER BY p_created_at DESC
                 LIMIT ${limit} OFFSET ${p * limit - limit};
                `;

  const { rows: players } = await db.query(query, [`%${search}%`]);

  return {
    count: +count,
    players,
    exactMatch: !exactMatch || exactMatch.length === 0 ? null : exactMatch[0],
  };
};

exports.fetchPlayerInfo = async ({ player }) => {
  const playerQuery = `SELECT * FROM players WHERE player_name = $1`;
  const notesQuery = `SELECT * FROM notes WHERE player_name = $1`;
  const tendenciesQuery = `SELECT * FROM tendencies WHERE player_name = $1`;

  const {
    rows: [playerInfo],
  } = await db.query(playerQuery, [player]);

  if (!playerInfo)
    return Promise.reject({ status: 404, message: "Non-existent user" });

  const { rows: notes } = await db.query(notesQuery, [player]);
  const { rows: tendencies } = await db.query(tendenciesQuery, [player]);

  return { player: playerInfo, notes, tendencies };
};

exports.insertPlayer = async ({ player_name, type = null }) => {
  if (typeof player_name === "object")
    return Promise.reject({ status: 400, message: "Invalid body" });

  if (!(await checkPlayer(player_name)))
    return Promise.reject({ status: 400, message: "User already exists" });

  const query = `INSERT INTO players(player_name, type) VALUES ($1, $2) RETURNING *`;
  const {
    rows: [player],
  } = await db.query(query, [player_name, type]);

  return { player };
};
