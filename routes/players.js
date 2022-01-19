const playersRouter = require("express").Router();
const { getPlayers } = require("../controllers/players");

playersRouter.get("/", getPlayers);

module.exports = playersRouter;
