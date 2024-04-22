const Token = require('../models/tokenModel');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const { catchAsync } = require('../utils/catchAsync');

exports.verifyEmail = catchAsync(async (req, res, next) => {
  // 1- if user exists
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError(401, 'Invalid link'));
  // 2- if token valid
  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!token) return next(new AppError(401, 'User not found'));
  // 3-verify
  user.isVerified = true;
  await user.save();
  res.status(200).json({
    message: 'Email verified successfully',
  });
});
exports.getUsersForSidebar = catchAsync(async (req, res, next) => {
  console.log('hello');
  const loggedInUserId = req.user._id;

  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select('-password');

  res.status(200).json(filteredUsers);
});
