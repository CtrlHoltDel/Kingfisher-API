const { fetchPlayers } = require("../models/players");
const { allItems } = require("../utils/db");

exports.getPlayers = async (req, res, next) => {
  try {
    const players = await fetchPlayers(req.query);
    res.status(200).send({ players });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
