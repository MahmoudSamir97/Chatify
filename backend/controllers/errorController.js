const AppError = require('../utils/error-handlers/AppError');

const handleCastErrorFromDB = (err) => {
  const message = `Invalid ${err.path} with value ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateFieldsFromDB = (err) => {
  const fieldname = Object.keys(err.keyValue)[0];
  const message = `Duplicate ${fieldname} value, please choose unique value`;
  return new AppError(400, message);
};
const handleValidationsErrorFromDB = (err) => {
  console.log(err);
  const errors = Object.values(err.errors).map((item) => item.message);
  const message = `Invalid input data. ${errors.join(' .')}`;
  return new AppError(400, message);
};

const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (res, err) => {
  // Expected error, send it to client!
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // unexpected error , from unkonwn resource. dont send error details to user!
  else {
    console.error('😁', err);
    res.status(500).json({
      status: 'error',
      message: 'something went wrong!',
    });
  }
};
// START
exports.globaleErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, err);
  }
  if (process.env.NODE_ENV === 'production') {
    if (err.kind === 'ObjectId') {
      sendErrorProd(res, handleCastErrorFromDB(err));
    } else if (err.code === 11000) {
      sendErrorProd(res, handleDuplicateFieldsFromDB(err));
    } else if (err.name === 'ValidationError') {
      sendErrorProd(res, handleValidationsErrorFromDB(err));
    } else {
      sendErrorProd(res, new AppError(err.statusCode, err.message));
    }
  }
};
