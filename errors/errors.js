exports.customError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ error: err });
    return;
  }

  if (err.message === "Missing credentials") {
    res.status(400).send({ error: { status: 400, message: err.message } });
    return;
  }

  next(err);
};

exports.serverError = (err, req, res, next) => {
  console.log(err, "<< Uncaught error");
  res.status(500);
};
