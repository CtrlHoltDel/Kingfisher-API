const playersRouter = require("express").Router();
const {
  getPlayers,
  getPlayerInfo,
  postPlayer,
  patchType,
} = require("../controllers/players");

playersRouter.route("/").get(getPlayers).post(postPlayer);
playersRouter.get("/:player", getPlayerInfo);
playersRouter.patch("/:player/type", patchType);

module.exports = playersRouter;
