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
