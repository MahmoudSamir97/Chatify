const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const { catchAsync } = require('../utils/error-handlers/catchAsync.js');
const AppError = require('../utils/error-handlers/AppError.js');

const protectRoute = catchAsync(async (req, res, next) => {
  const token = req.coockie.token;

  if (!token)
    return next(new AppError(401, 'Unauthorized - No Token Provided'));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) return next(new AppError(401, 'Unauthorized - Invalid Token'));

  const user = await User.findById(decoded.userId).select('-password');

  if (!user) return next(new AppError(404, 'User not found'));

  req.user = user;

  next();
});

module.exports = protectRoute;
