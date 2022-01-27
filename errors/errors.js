exports.customError = (error, req, res, next) => {
  console.log(error.status, "<< Log check");
  res.status(error.status).send({ error });
  next();
};

exports.serverError = (err, req, res, next) => {
  console.log(err, "<< Uncaught error");
  res.status(500);
};
