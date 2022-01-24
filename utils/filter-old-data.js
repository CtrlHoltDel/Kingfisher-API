const { oldPlayers } = require("../db/data/old/old-players");
const fs = require("fs/promises");

const config = {
  playerHeader: "\\",
};

const filterData = async (allInfo, { playerHeader }) => {
  const playerNames = allInfo.map((player, index) => {
    if (player[playerHeader].length === 1) {
      return;
    }
    return player["\\"];
  });

  let playerNamesNoDuplicates = [...new Set(playerNames)].filter(
    (player) => player
  );

  const formattedPlayers = playerNamesNoDuplicates.map((player) => {
    return { name: player, aliases: [] };
  });

  allInfo.forEach((playerInfo) => {
    const name = playerInfo["\\"];
    const { SUMMARY, TENDENCIES, NOTES } = playerInfo;
    const indexInFinal = formattedPlayers.findIndex(
      (item) => item.name === name
    );
    if (formattedPlayers[indexInFinal]) {
      formattedPlayers[indexInFinal].type =
        SUMMARY && typeof SUMMARY === "string" ? SUMMARY : null;

      if (formattedPlayers[indexInFinal].tendencies) {
        if (TENDENCIES !== "")
          formattedPlayers[indexInFinal].tendencies.push(TENDENCIES);
      } else {
        formattedPlayers[indexInFinal].tendencies =
          TENDENCIES === "" ? [] : [TENDENCIES];
      }

      if (formattedPlayers[indexInFinal].notes) {
        formattedPlayers[indexInFinal].notes.push(NOTES);
      } else {
        formattedPlayers[indexInFinal].notes = NOTES === "" ? [] : [NOTES];
      }
    }
  });

  const players = formattedPlayers.map(({ name, type }) => {
    return { name, type };
  });

  const notes = [];
  const tendencies = [];

  formattedPlayers.forEach((player) => {
    player.notes.forEach((note) => {
      notes.push({
        player: player.name,
        created_by: "unknown",
        note: note,
        added: Date.now(),
      });
    });

    player.tendencies.forEach((tendency) => {
      tendencies.push({
        player: player.name,
        created_by: "unknown",
        tendency: tendency,
        added: Date.now(),
      });
    });
  });

  try {
    await fs.writeFile(
      `${__dirname.slice(0, -6)}/db/data/all.js`,
      `exports.allPlayers = ${JSON.stringify(formattedPlayers)}`
    );

    console.log(`all.js created`);
    await fs.writeFile(
      `${__dirname.slice(0, -6)}/db/data/players.js`,
      `exports.players = ${JSON.stringify(players)}`
    );

    console.log(`players.js created`);
    await fs.writeFile(
      `${__dirname.slice(0, -6)}/db/data/notes.js`,
      `exports.notes = ${JSON.stringify(notes)}`
    );

    console.log(`notes.js created`);
    await fs.writeFile(
      `${__dirname.slice(0, -6)}/db/data/tendencies.js`,
      `exports.tendencies = ${JSON.stringify(tendencies)}`
    );

    console.log("tendendies.js created");
    await fs.writeFile(
      `${__dirname.slice(0, -6)}/db/data/index.js`,
      `exports.notes = require("./notes");
        exports.tendencies = require("./tendencies");
        exports.players = require("./players");
    `
    );

    console.log("index created");
  } catch (err) {
    throw err;
  }
};

filterData(oldPlayers, config);
