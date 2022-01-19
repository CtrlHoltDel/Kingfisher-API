const tendenciesRouter = require("express").Router();
const { getTendenciesByPlayer } = require("../controllers/tendencies");

tendenciesRouter.get("/", getTendenciesByPlayer);

module.exports = tendenciesRouter;
