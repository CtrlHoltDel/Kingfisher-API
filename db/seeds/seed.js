const { fillTables } = require("./utils/fillTables");
const { dropTables, createTables } = require("./utils/tables");

const seed = async (data) => {
  await dropTables();
  await createTables();
  await fillTables(data);
};

module.exports = seed;
