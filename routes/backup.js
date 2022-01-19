const { generateBackups } = require("../utils/backup");

const backupRouter = require("express").Router();

backupRouter.get("/:filename", async (req, res, next) => {
  const key = ["all.json", "notes.csv", "players.csv", "tendencies.csv"];

  if (!key.includes(req.params.filename)) {
    res.status(404).send("invalid filename");
    return;
  }

  try {
    await generateBackups();
    res.sendFile(
      `${__dirname.slice(0, -7)}/backu/${req.params.filename}`,
      (err) => {
        if (err) {
          res.status(404).send(`No file found`);
        } else {
          res.status(200);
        }
      }
    );
  } catch (error) {
    next(err);
  }
});

module.exports = backupRouter;
