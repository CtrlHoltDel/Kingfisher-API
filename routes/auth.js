const { postLogin, postRegister } = require("../controllers/auth");

const authRouter = require("express").Router();

authRouter.post("/login", postLogin);
authRouter.post("/register", postRegister);

module.exports = authRouter;
