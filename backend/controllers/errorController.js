const AppError = require('../utils/AppError');

const handleCastErrorFromDB = (err) => {
  const message = `Invalid ${err.path} with value ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateFieldsFromDB = (err) => {
  const keyValueString = JSON.stringify(err.keyValue);
  const message = `Duplicate field value ${keyValueString}, please use another value`;
  return new AppError(400, message);
};
const handleValidationsErrorFromDB = (err) => {
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
  // unexpected error , from unkonwn resource. dont send error details to client!
  else {
    // 1-)log error
    console.error('😁', err);
    // 2-)send response
    res.status(500).json({
      status: 'error',
      message: 'something went wrong!',
    });
  }
};

exports.globaleErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.kind === 'ObjectId') error = handleCastErrorFromDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsFromDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationsErrorFromDB(error);
    sendErrorProd(res, error);
  }
};
