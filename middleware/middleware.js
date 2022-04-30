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

    console.log(process.env)

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

exports.liveLog = (req, res, next) => {
  if (req.url.split("/")[1] === "admin") {
    next();
    return;
  }
  if (
    !(req.url.slice(0, 9) === "/players?") ||
    req.url.split("/")[1] === "admin"
  ) {
    let type = null;
    let player = null;
    let user = req.authData.user.username;
    let body = null;

    if (req.method === "POST") {
      const [, currType, currPlayer] = req.url.split("/");
      if (currType === "players") {
        player = req.body.player_name;
        type = `add-player`;
      } else {
        player = currPlayer;
        type = `add-${currType}`;
        body = currType === "notes" ? req.body.note : req.body.tendency;
      }
    }
    if (req.method === "GET") {
      player = req.url.slice(9);
      type = `lookup`;
    }
    if (req.method === "DELETE") {
      let [, , id] = req.url.split("/");
      type = `del ${req.url.slice(1, 2)}`;
      body = id;
    }
    if (req.method === "PATCH") {
      player = req.url.split("/")[2];
      body = req.body.type;
      type = `patch-type`;
    }

    req.io.emit("live-message", user, player, type, new Date(), body);
  }
  next();
};
