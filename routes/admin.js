const {
  getUsers,
  patchUser,
  delUser,
  getRecent,
  generateKey,
} = require("../controllers/admin");

const adminRouter = require("express").Router();

adminRouter.route("/users").get(getUsers);
adminRouter.route("/users/:id").patch(patchUser).delete(delUser);
adminRouter.get("/recent", getRecent);
adminRouter.get("/generateKey", generateKey);

module.exports = adminRouter;
