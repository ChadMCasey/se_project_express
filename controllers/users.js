const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequest = require("../utils/badRequest");
const {
  INVALID_DATA,
  INVALID_ENDPOINT,
  SERVER_ERROR,
  CONFLICT_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        res
          .status(INVALID_ENDPOINT)
          .send({ message: "Requested resource not found" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA).send({ message: "Invalid data" });
      } else if (err.name === "MongoServerError") {
        res
          .status(CONFLICT_ERROR)
          .send({ message: "the provided email has already been registered." });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token }); // send to browser
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof BadRequest || err.name === "TypeError") {
        res.status(INVALID_DATA).send({ message: err.message });
      } else if (err.name === "InvalidData") {
        res
          .status(err.status)
          .send({ message: "invalid username or password" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError" || err.name === "DocumentNotFoundError") {
        res.status(INVALID_DATA).send({ message: "Invalid data" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const updateProfile = (req, res) => {
  const { avatar, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar, name }, // updates
    { new: true, runValidators: true }, // options
  )
    .orFail()
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError" || err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: "Invalid Data" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports = {
  getUsers,
  createUser,
  updateProfile,
  getCurrentUser,
  loginUser,
};
