const joi = require('joi');

// PATTERNS
const passwordPattern = new RegExp(/^[A-Z][A-Za-z1-9]{5,}[@#$%^&*]{1,}$/);
const usernamePattern = new RegExp(/^[A-Za-z]{6,}[0-9@#$%^&*]{1,}$/);

const signupSchema = joi.object({
  fullname: joi.string().min(8).required().messages({
    'string.base': 'full name" should be a type of "text".',
    'string.min':
      'full name" length must be at least {#limit} characters long.',
    'any.required': 'full name" is a required field.',
  }),
  username: joi.string().regex(usernamePattern).required().messages({
    'string.base': 'username" should be a type of "text".',
    'string.pattern.base':
      'username" must start with uppercase and includes numbers or special characters.',
    'any.required': 'username" is a required field.',
  }),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'email" must be a valid email address.',
      'any.required': 'email" is a required field.',
    }),
  password: joi.string().pattern(passwordPattern).required().messages({
    'string.pattern.base':
      'password" must start with Uppercase and includes special character.',
    'any.required': 'password" is a required field.',
  }),
  confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
    'any.only': 'confirmPassword" must match "password".',
    'any.required': 'confirmPassword" is a required field.',
  }),
});

module.exports = signupSchema;
