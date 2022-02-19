exports.customError = (error, req, res, next) => {
  if (error.status) {
    res.status(error.status).send({ error });
    return;
  }

  if (error.message === "Missing credentials") {
    res
      .status(400)
      .send({ error: { status: 400, message: "Missing credentials" } });
    return;
  }

  next(error);
};

exports.serverError = (err, req, res, next) => {
  console.log(err, "<< Uncaught error");
  res.status(500);
};
