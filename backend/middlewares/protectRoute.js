const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const { catchAsync } = require('../utils/error-handlers/catchAsync.js');
const AppError = require('../utils/error-handlers/AppError.js');

const protectRoute = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(
      new AppError(401, 'Missing authenticated Token!, Please login')
    );
  // 2-)TOKEN VERIFICATION
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // 3-)CHECK IF USER EXIST
  const user = await User.findById(decoded.userId);

  if (!user)
    return next(new AppError(401, 'Invalid signature! please log in again'));
  req.user = user;
  next();

  // const token = req.coockie.jwt;
  // if (!token)
  //   return next(new AppError(401, 'Unauthorized - No Token Provided'));
  // // res.status(401).json({ error: 'Unauthorized - No Token Provided' });

  // const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // if (!decoded) return next(new AppError(401, 'Unauthorized - Invalid Token'));
  // // res.status(401).json({ error: 'Unauthorized - Invalid Token' });

  // const user = await User.findById(decoded.userId).select('-password');

  // if (!user) return next(new AppError(404, 'User not found'));
  // // res.status(404).json({ error: 'User not found' });

  // req.user = user;

  // next();
});

module.exports = protectRoute;
