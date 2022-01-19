const { getBackup } = require("../controllers/backup");

const backupRouter = require("express").Router();

backupRouter.get("/", getBackup);

module.exports = backupRouter;
