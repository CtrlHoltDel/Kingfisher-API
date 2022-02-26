const jwt = require("jsonwebtoken");
const db = require("../db/connection");

exports.verifyUserToken = async (req, res, next) => {
  const bearerHeader = req.headers["authorisation"];

  if (typeof bearerHeader === "undefined") {
    next({ status: 403, message: "Restricted" });
    return;
  }

  try {
    const authData = await jwt.verify(
      bearerHeader.split(" ")[1],
      process.env.JWT_SECRET
    );

    if (!authData.user.validated) {
      next({ status: 403, message: "Unvalidated Account" });
      return;
    }

    const { rows } = await db.query(`SELECT * FROM users WHERE user_id = $1`, [
      authData.user.user_id,
    ]);

    if (!rows[0].validated) {
      next({ status: 403, message: "Unvalidated Account" });
      return;
    }

    req.authData = authData;
    next();
  } catch (err) {
    next({
      status: 403,
      message: err.message,
    });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (!req.authData.user.admin) {
    next({ status: 403, message: "Contact an administrator" });
  }
  next();
};

exports.logger = (req, res, next) => {
  const { username } = req.authData.user;

  if (req.method === "GET" && !(req.url.slice(0, 9) === "/players?")) {
    const player = req.url.slice(9);
    console.log(`${username} looked up ${player}`);
  }

  if (req.method === "POST") {
    if (req.body.player_name)
      console.log(`${username} added ${req.body.player_name}`);

    if (req.body.tendency)
      console.log(
        `${username} added the tendency ${req.body.tendency} to ${req.url.slice(
          12
        )}`
      );

    if (req.body.note)
      console.log(
        `${username} added the note ${req.body.note} to ${req.url.slice(7)}`
      );
  }

  if (req.method === "DELETE") {
    if (req.url.slice(0, 11) === "/tendencies") {
      console.log(`${username} deleted tendency ${req.url.slice(12)}`);
    } else {
      console.log(`${username} deleted note ${req.url.slice(7)}`);
    }
  }

  if (req.method === "PATCH") {
    const player = req.url.slice(9, -5);
    console.log(`${username} updated ${player} to ${req.body.type}`);
  }

  next();
};
