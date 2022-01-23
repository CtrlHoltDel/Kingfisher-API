const { removeTendency, amendTendency } = require("../models/tendencies");

exports.delTendency = async (req, res, next) => {
  try {
    await removeTendency(req.params);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.patchTendency = async (req, res, next) => {
  try {
    const tendency = await amendTendency(req.params, req.body);
    res.status(201).send(tendency);
  } catch (err) {
    next(err);
  }
};
