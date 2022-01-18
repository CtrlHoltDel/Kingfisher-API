const { fetchPlayers } = require("../models/players");

exports.getPlayers = async (req, res, next) => {
  try {
    const players = await fetchPlayers(req.query);
    res.status(200).send({ players });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
