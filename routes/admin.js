const { getUsers } = require("../controllers/admin");

const adminRouter = require("express").Router();

adminRouter.post("/users", getUsers);

module.exports = adminRouter;
