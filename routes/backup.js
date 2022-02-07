const { getJSON, getCSV } = require("../controllers/backup");

const backupRouter = require("express").Router();

backupRouter.get("/", getJSON);
backupRouter.get("/all.csv", getCSV);

module.exports = backupRouter;
