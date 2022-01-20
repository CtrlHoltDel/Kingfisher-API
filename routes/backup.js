const { getBackup } = require("../controllers/backup");
const { generateCSV } = require("../utils/generateCSV");

const backupRouter = require("express").Router();

backupRouter.get("/", getBackup);
backupRouter.get("/csv", async (req, res, next) => {
  res.send(200);
});

module.exports = backupRouter;
