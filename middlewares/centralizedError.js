const errorHandler = (err, req, res, next) => {
  console.log(err);
  const { message, status = 500 } = err;

  res.stauts(err.status).send({
    message: status === 500 ? "An error occured on the server" : err.message,
  });
};

module.exports = errorHandler;
