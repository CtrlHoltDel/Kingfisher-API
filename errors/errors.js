exports.customError = (err, req, res, next) => {
  res.status(err.status).send(err.message);
};

exports.serverError = (err, req, res, next) => {
  console.log(err, "<< Uncaught error");
  res.status(500);
};
