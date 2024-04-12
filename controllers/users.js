const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/Errors/UnauthorizedError");
const BadRequestError = require("../utils/Errors/BadRequestError");
const ConflictError = require("../utils/Errors/ConflictError");
const NotFoundError = require("../utils/Errors/NotFoundError");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
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
      if (err.name === "ValidationError") {
        next(new BadRequestError("The data entered is invalid."));
      } else if (err.name === "MongoServerError") {
        next(new ConflictError("An error occured on the server."));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res) => {
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      const { name, email, avatar, _id } = user;
      res.send({ token, name, email, avatar, _id }); // send to browser
    })
    .catch((err) => {
      if (err.name === "InvalidData") {
        next(new BadRequestError("invalid username or password"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data format."));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found."));
      } else {
        next(err);
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
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found."));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
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
