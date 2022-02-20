const { getUsers, patchUser, delUser } = require("../controllers/admin");

const adminRouter = require("express").Router();

adminRouter.route("/users").get(getUsers);
adminRouter.route("/users/:id").patch(patchUser).delete(delUser);

module.exports = adminRouter;
