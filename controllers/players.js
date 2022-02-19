const {
  fetchPlayers,
  fetchPlayerInfo,
  insertPlayer,
  amendType,
} = require("../models/players");

exports.getPlayers = async (req, res, next) => {
  try {
    const players = await fetchPlayers(req.query);
    res.status(200).send(players);
  } catch (err) {
    next(err);
  }
};

exports.getPlayerInfo = async (req, res, next) => {
  try {
    const player = await fetchPlayerInfo(req.params);
    res.status(200).send(player);
  } catch (err) {
    next(err);
  }
};

exports.postPlayer = async (req, res, next) => {
  try {
    const newPlayer = await insertPlayer(req.body, req.authData);
    res.status(201).send(newPlayer);
  } catch (err) {
    next(err);
  }
};

exports.patchType = async (req, res, next) => {
  try {
    const player = await amendType(req.params, req.body);
    res.status(201).send(player);
  } catch (err) {
    next(err);
  }
};
