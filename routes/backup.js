const { getJSON } = require("../controllers/backup");

const backupRouter = require("express").Router();

backupRouter.get("/:backupKey", getJSON);
// backupRouter.get("/all.csv", getCSV);

module.exports = backupRouter;
