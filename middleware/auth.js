const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");
const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  req.user = payload;
  next();
};

module.exports = {
  authorize,
};
