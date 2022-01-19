const { fetchBackup } = require("../models/backup");

exports.getBackup = async (req, res, next) => {
  try {
    const backupJSON = await fetchBackup();
    res.status(200).send(backupJSON);
  } catch (err) {
    next(err);
  }
};
