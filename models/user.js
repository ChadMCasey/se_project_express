const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const BadRequest = require("../utils/badRequest");

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
        return Promise.reject(new BadRequest("Incorrect email or password."));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new BadRequest("Incorrect email or password."));
        }
        return user; // if we find a match then send back the user.
      });
    })
    .catch(() => {
      if (!email || !password) {
        const invalidData = new Error();
        invalidData.status = 400;
        invalidData.name = "InvalidData";
        return Promise.reject(invalidData);
      }
    });
};

module.exports = mongoose.model("user", User);
