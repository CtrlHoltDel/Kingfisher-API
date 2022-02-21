const {
  getUsers,
  patchUser,
  delUser,
  getRecent,
} = require("../controllers/admin");

const adminRouter = require("express").Router();

adminRouter.route("/users").get(getUsers);
adminRouter.route("/users/:id").patch(patchUser).delete(delUser);
adminRouter.get("/recent", getRecent);

module.exports = adminRouter;
