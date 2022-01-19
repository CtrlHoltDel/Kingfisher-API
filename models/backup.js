const { allItems } = require("../utils/db");

exports.fetchBackup = async () => {
  const players = await allItems("players");
  const notes = await allItems("notes");
  const tendencies = await allItems("tendencies");

  return { players, notes, tendencies };
};
