const joi = require('joi');

const passwordPattern = new RegExp(/^[A-Z][A-Za-z1-9]{5,}[@#$%^&*]{1,}$/);
const resetSchema = joi.object({
  newPassword: joi
    .string()
    .pattern(passwordPattern)
    .empty('')
    .required()
    .messages({
      'string.pattern.base':
        'Password must start with uppercase and includes special characters.',
      'any.required': 'Password should not be empty!',
    }),
  confirmNewPassword: joi
    .string()
    .empty('')
    .valid(joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Confirm Password must match password.',
      'any.required': 'Confirm password should not be empty.',
    }),
});

module.exports = resetSchema;
