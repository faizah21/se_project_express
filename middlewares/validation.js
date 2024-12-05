const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

function validateURL(value, helpers) {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
}

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field can not be empty',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field can not be empty',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold"),
  }),
});

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field can not be empty',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field can not be empty',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "name" field can not be empty',
    }),
    password: Joi.string().required().min(8).messages({
      "string.empty": 'The "name" field can not be empty',
    }),
  }),
});

const validateUserAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "name" field can not be empty',
    }),
    password: Joi.string().required().min(8).messages({
      "string.empty": 'The "name" field can not be empty',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required().messages({
      "string.empty": 'The "id" field can not be empty',
      "string.length": 'The "id" field must have a length of 24',
    }),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});

module.exports = {
  validateUpdateUser,
  validateId,
  validateClothingItem,
  validateUserAuthentication,
  validateUserCreation,
};
