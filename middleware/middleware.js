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

const insertLog = (method, username, message, player) => {
  // db.query(
  //   `INSERT INTO logs(method, username, message, player) VALUES ($1, $2, $3, $4)`,
  //   [method, username, message, player]
  // );
};

exports.logger = (req, res, next) => {
  //   const { username } = req.authData.user;

  //   if (
  //     req.method === "GET" &&
  //     !(req.url.slice(0, 9) === "/players?") &&
  //     !(req.url === "/admin/generateKey")
  //   ) {
  //     console.log(req.url);
  //     const player = req.url.slice(9);
  //     insertLog(req.method, username, `${username} looked up ${player}`, player);
  //   }

  //   if (req.method === "POST") {
  //     let message = "";
  //     let player = null;

  //     if (req.body.note) {
  //       player = req.url.slice(7);
  //       message = `${username} added the note ${req.body.note} to ${player}`;
  //     } else if (req.body.tendency) {
  //       player = req.url.slice(12);
  //       message = `${username} added the tendency ${req.body.tendency} to ${player}`;
  //     } else if (req.body.player_name) {
  //       player = req.body.player_name;
  //       message = `${username} added ${player}`;
  //     } else {
  //       message = "unknown";
  //     }

  //     insertLog(req.method, username, message, player);
  //   }

  //   if (req.method === "DELETE") {
  //     insertLog(
  //       req.method,
  //       username,
  //       req.url.slice(0, 11) === "/tendencies"
  //         ? `${username} deleted tendency ${req.url.slice(12)}`
  //         : `${username} deleted note ${req.url.slice(7)}`
  //     );
  //   }

  //   if (req.method === "PATCH") {
  //     const player = req.url.slice(9, -5);

  //     insertLog(
  //       req.method,
  //       username,
  //       `${username} updated ${player} to ${req.body.type}`,
  //       "test",
  //       player
  //     );
  //   }

  next();
};
