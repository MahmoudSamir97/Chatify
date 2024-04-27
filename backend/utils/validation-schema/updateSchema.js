const joi = require('joi');

const usernamePattern = new RegExp(/^[A-Za-z]{6,}[0-9@#$%^&*]{1,}$/);

const updateSchema = joi.object({
  fullname: joi.string().min(8).allow('').messages({
    'string.base': 'Fullname should be a type of "text".',
    'string.min': 'Fullname must be at least 8 characters long.',
  }),

  username: joi.string().allow('').regex(usernamePattern).messages({
    'string.base': 'Username should be a type of "text".',
    'string.pattern.base':
      'Username must start with uppercase and includes special character.',
  }),

  phoneNumber: joi.string().allow('').messages({
    'string.base': 'Phone number should be a type of "text".',
  }),

  bio: joi.string().allow('').messages({
    'string.base': 'Bio should be a type of "text".',
  }),
});

module.exports = updateSchema;
