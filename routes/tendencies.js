const tendenciesRouter = require("express").Router();
const { delTendency, patchTendency } = require("../controllers/tendencies");

tendenciesRouter.route("/:id").delete(delTendency).patch(patchTendency);

module.exports = tendenciesRouter;
