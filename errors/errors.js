exports.customError = (error, req, res, next) => {
  res.status(error.status).send({ error });
  next();
};

exports.serverError = (err, req, res, next) => {
  console.log(err, "<< Uncaught error");
  res.status(500);
};
