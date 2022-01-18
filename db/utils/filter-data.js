const { oldPlayers } = require("../data/old/old-players");
const fs = require("fs/promises");

const filterData = (allInfo) => {
  const playerNames = allInfo.map((player, index) => {
    if (player["\\"].length === 1) {
      return;
    }
    return player["\\"].toLowerCase();
  });

  let playerNamesNoDuplicates = [...new Set(playerNames)].filter(
    (player) => player
  );

  const formattedPlayers = playerNamesNoDuplicates.map((player) => {
    return { name: player, aliases: [] };
  });

  allInfo.forEach((playerInfo) => {
    const name = playerInfo["\\"].toLowerCase();
    const { SUMMARY, TENDENCIES, NOTES } = playerInfo;
    const indexInFinal = formattedPlayers.findIndex(
      (item) => item.name === name
    );
    if (formattedPlayers[indexInFinal]) {
      if (formattedPlayers[indexInFinal].tendencies) {
        if (TENDENCIES !== "")
          formattedPlayers[indexInFinal].tendencies.push(TENDENCIES);
      } else {
        formattedPlayers[indexInFinal].tendencies =
          TENDENCIES === "" ? [] : [TENDENCIES];
      }

      formattedPlayers[indexInFinal].type =
        SUMMARY && typeof SUMMARY === "string" ? SUMMARY.toLowerCase() : null;

      if (formattedPlayers[indexInFinal].notes) {
        formattedPlayers[indexInFinal].notes.push(NOTES);
      } else {
        formattedPlayers[indexInFinal].notes = NOTES === "" ? [] : [NOTES];
      }
    }
  });

  const players = formattedPlayers.map(({ name, aliases, type }) => {
    return { name, aliases, type };
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

  fs.writeFile(
    "./db/data/all.js",
    `exports.allPlayers = ${JSON.stringify(formattedPlayers)}`
  )
    .then(async () => {
      console.log(`all.js created`);
      await fs.writeFile(
        "./db/data/players.js",
        `exports.players = ${JSON.stringify(players)}`
      );
    })
    .then(async () => {
      console.log(`players.js created`);
      await fs.writeFile(
        "./db/data/notes.js",
        `exports.notes = ${JSON.stringify(notes)}`
      );
    })
    .then(async () => {
      console.log(`notes.js created`);
      await fs.writeFile(
        "./db/data/tendencies.js",
        `exports.tendencies = ${JSON.stringify(tendencies)}`
      );
    })
    .catch((err) => {
      throw err;
    });
};

filterData(oldPlayers);
