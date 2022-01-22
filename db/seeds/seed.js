const { fillTables } = require("./utils/filltables");
const { updateTables } = require("./utils/updateTables");
const { dropTables, createTables } = require("./utils/tables");

const seed = async (data, update) => {
  await dropTables();
  await createTables();
  update ? await updateTables(data) : await fillTables(data);
};

module.exports = seed;
