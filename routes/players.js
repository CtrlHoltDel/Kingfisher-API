const playersRouter = require("express").Router();
const {
  getPlayers,
  getPlayerInfo,
  postPlayer,
} = require("../controllers/players");

playersRouter.route("/").get(getPlayers).post(postPlayer);
playersRouter.get("/:player", getPlayerInfo);

module.exports = playersRouter;
