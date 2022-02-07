const { oldPlayers } = require("./old/old-players");
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
    return { name: player, aliases: null };
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

  const notes = [];
  const tendencies = [];

  formattedPlayers.forEach((player) => {
    player.notes.forEach((note) => {
      notes.push({
        player_name: player.name,
        n_created_by: "unknown",
        note: note,
        n_created_at: new Date(1643029362293),
      });
    });

    player.tendencies.forEach((tendency) => {
      tendencies.push({
        player_name: player.name,
        t_created_by: "unknown",
        tendency: tendency,
        t_created_at: new Date(1643029362293),
      });
    });
  });

  const players = formattedPlayers.map(({ name, type }) => {
    return {
      player_name: name,
      type,
      p_created_at: new Date(1643029362293),
      aliases: null,
    };
  });

  try {
    await fs.writeFile(
      `${__dirname}/sanitised/new.json`,
      JSON.stringify({ players, notes, tendencies })
    );
  } catch (err) {
    throw err;
  }
};

filterData(oldPlayers, config);
