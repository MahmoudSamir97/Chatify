const User = require('../models/userModel');
const { catchAsync } = require('../utils/catchAsync');

exports.getUsersForSidebar = catchAsync(async (req, res, next) => {
  const loggedInUserId = req.user._id;

  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select('-password');

  res.status(200).json(filteredUsers);
});
