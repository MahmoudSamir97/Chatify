const sides = ['body', 'params', 'query'];

exports.validation = (schema) => {
  return (req, res, next) => {
    const errors = [];
    sides.forEach((elem) => {
      if (schema[elem]) {
        const checkValidation = schema[elem].validate(req[elem], {
          abortEarly: false,
        });
        if (checkValidation && checkValidation.error) {
          errors.push(checkValidation.error.details);
        }
      }
    });
    if (errors.length) {
      res.status(400).json({
        status: 'fail',
        errors: errors[0],
      });
    } else {
      next();
    }
  };
};
