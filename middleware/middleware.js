const jwt = require("jsonwebtoken");

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

    req.authData = authData;
    next();
  } catch (err) {
    console.log(err.message);
    next({
      status: 403,
      message: err.message,
    });
  }
};

exports.verifyAdmin = (req, res, next) => {
  console.log(req.authData);
  if (!req.authData.user.admin) {
    next({ status: 403, error: "Contact an administrator" });
  }
  next();
};
