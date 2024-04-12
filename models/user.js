const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UnauthorizedError = require("../utils/Errors/UnauthorizedError");
const BadRequestError = require("../utils/Errors/BadRequestError");

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "you must enter a valid email",
    },
  },

  password: {
    type: String,
    required: true,
    select: false, // the users password hash wont be returned from db by default
  },

  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "you must enter a valid URL",
    },
  },
});

User.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError("Incorrect email or password."));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new UnauthorizedError("Incorrect email or password."));
        }
        return user;
      });
    })
    .catch((err) => {
      if (!email || !password) {
        next(new BadRequestError("The email or password fields are missing."));
      } else {
        next(err);
      }
    });
};

module.exports = mongoose.model("user", User);
