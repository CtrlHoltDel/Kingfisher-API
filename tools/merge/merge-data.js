const fs = require("fs/promises");

const mergePlayers = (curr, ss) => {
  return [...curr, ...ss].reduce((total, curr, index) => {
    const lowerCaseName = curr.player_name.toLowerCase();

    const player = { ...curr, player_name: lowerCaseName };

    return total.some(({ player_name }) => player_name === lowerCaseName)
      ? total
      : [...total, player];
  }, []);
};

const mergeNotes = (curr, ss) => {
  return [...curr, ...ss].reduce((total, curr) => {
    return total.some((note) => note.note === curr.note)
      ? total
      : [...total, { ...curr, player_name: curr.player_name.toLowerCase() }];
  }, []);
};

const mergeTendencies = (curr, ss) => {
  return [...curr, ...ss].reduce((total, curr) => {
    return total.some((tendency) => tendency.tendency === curr.tendency)
      ? total
      : [...total, { ...curr, player_name: curr.player_name.toLowerCase() }];
  }, []);
};

const mergeData = async () => {
  const ssData = await fs.readFile(`${__dirname}/oldData/ss.json`);
  const currData = await fs.readFile(`${__dirname}/oldData/curr.json`);

  const parsedSS = JSON.parse(ssData);
  const parsedCurr = JSON.parse(currData);

  const mergedPlayers = mergePlayers(parsedCurr.players, parsedSS.players);
  const mergedNotes = mergeNotes(parsedCurr.notes, parsedSS.notes);
  const mergedTendencies = mergeTendencies(
    parsedCurr.tendencies,
    parsedSS.tendencies
  );
  await fs.writeFile(
    `${__dirname}/newData/new.json`,
    JSON.stringify({
      players: mergedPlayers,
      notes: mergedNotes,
      tendencies: mergedTendencies,
    })
  );
};

mergeData();
