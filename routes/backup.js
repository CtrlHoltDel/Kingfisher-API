const { generateBackups } = require("../utils/backup");

const backupRouter = require("express").Router();

backupRouter.get("/:filename", async (req, res, next) => {
  const key = ["all.json", "notes.csv", "players.csv", "tendencies.csv"];

  if (!key.includes(req.params.filename)) {
    res.status(404).send("invalid filename");
    return;
  }

  await generateBackups();

  res.sendFile(
    `${__dirname.slice(0, -7)}/backup/${req.params.filename}`,
    (err) => {
      if (err) {
        res.status(404).send(`No file found`);
      } else {
        res.status(200);
      }
    }
  );
});

module.exports = backupRouter;
