const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "An error occured on the server";

  res.status(status).send({
    message,
  });
};

module.exports = errorHandler;
