const { fetchJSON, fetchCSV } = require("../models/backup");

exports.getJSON = async (req, res, next) => {
  try {
    const backup = await fetchJSON();
    res.send(backup);
  } catch (err) {
    next(err);
  }
};

exports.getCSV = async (req, res, next) => {
  try {
    await fetchCSV();
    res.sendFile(`${__dirname.slice(0, -12)}/backup/all.csv`);
  } catch (err) {
    next(err);
  }
};
