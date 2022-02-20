const { getUsers, patchUser } = require("../controllers/admin");

const adminRouter = require("express").Router();

adminRouter.route("/users").get(getUsers);
adminRouter.patch("/users/:id", patchUser);

module.exports = adminRouter;
