const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
const db = require("../db/connection");
const jwt = require("jsonwebtoken");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await db.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
      );

      const user = rows[0];
      if (!user) {
        done(null, false, { status: 400, message: "Non-existent user" });
        return;
      }

      const checkPassword = await bcrypt.compare(password, rows[0].password);

      if (checkPassword) {
        const token = await jwt.sign({ user }, process.env.JWT_SECRET);

        const { username, admin, validated } = user;

        done(null, { username, token, admin, validated });
      } else {
        done(null, false, { status: 400, message: "Incorrect Password" });
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
