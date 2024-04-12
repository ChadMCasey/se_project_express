const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// validate our URL's using validator package
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.errors("string.uri");
};

// validate information for card creation
const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'imageUrl' field must be filled in",
      "string.uri": "The 'imageUrl' field must be a valid url",
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold"),
  }),
});

// validate information for user registration
const validateUserRegister = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled in",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The 'password' field must be filled in",
    }),
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'avatar' field must be filled in",
      "string.uri": "The 'avatar' field must be a valid url",
    }),
  }),
});

// validate information for user login
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "Please enter a valid email address.",
    }),
    password: Joi.string().required(),
  }),
});

// validate item id present in URL params
const validateItemID = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24),
  }),
});

module.exports = {
  validateItemID,
  validateUserLogin,
  validateUserRegister,
  validateCardBody,
};
