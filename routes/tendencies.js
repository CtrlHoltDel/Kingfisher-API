const tendenciesRouter = require("express").Router();
const {
  delTendency,
  patchTendency,
  postTendency,
} = require("../controllers/tendencies");

tendenciesRouter.route("/:id").delete(delTendency).patch(patchTendency);
tendenciesRouter.post("/:player", postTendency);

module.exports = tendenciesRouter;
