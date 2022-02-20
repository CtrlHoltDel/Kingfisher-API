const passport = require("passport");
const { handleRegister } = require("../models/auth");

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return next(info);
    res.json({ user });
  })(req, res, next);
};

exports.postRegister = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await handleRegister(username, password);
    res.status(201).send({ user });
  } catch (err) {
    next(err);
  }
};
