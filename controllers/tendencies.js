const { fetchTendenciesByPlayer } = require("../models/tendencies");

exports.getTendenciesByPlayer = async (req, res, next) => {
  try {
    const result = await fetchTendenciesByPlayer(req.player);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
