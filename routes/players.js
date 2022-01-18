const { getPlayers } = require("../controllers/players");

const playersRouter = require("express").Router();

playersRouter.get("/", getPlayers);

module.exports = playersRouter;
