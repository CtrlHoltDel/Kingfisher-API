const { fetchJSON, fetchCSV } = require("../models/backup");

exports.getJSON = async (req, res, next) => {
  try {
    const backupJSON = await fetchJSON();
    res.status(200).send(backupJSON);
  } catch (err) {
    next(err);
  }
};

exports.getCSV = async (req, res, next) => {
  try {
    await fetchCSV(req.params.file);
    res.sendFile(`${__dirname.slice(0, -12)}/backup/${req.params.file}`);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
