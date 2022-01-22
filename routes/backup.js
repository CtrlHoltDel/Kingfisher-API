const { getJSON, getCSV } = require("../controllers/backup");

const backupRouter = require("express").Router();

backupRouter.get("/", getJSON);
backupRouter.get("/csv/:file", getCSV);

module.exports = backupRouter;
