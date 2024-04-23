const User = require('../models/userModel');
const { catchAsync } = require('../utils/error-handlers/catchAsync');
const AppError = require('../utils/error-handlers/AppError');
const Token = require('../models/tokenModel');

const resetMiddleware = catchAsync(async (req, res, next) => {
  /* VALIDATE LINK */
  // 1- if user exists
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError(404, 'Invalid link - user not found!'));
  // 2- if token valid
  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!token || token.hasExpired())
    return next(new AppError(401, 'Invalid link '));
  req.data = { user, token };
  next();
});
module.exports = resetMiddleware;
