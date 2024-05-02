const User = require('../models/userModel');
const imageDataURI = require('image-data-uri');
const { uploadImage, destroy } = require('../services/cloudinary');
const AppError = require('../utils/error-handlers/AppError');
const { catchAsync } = require('../utils/error-handlers/catchAsync');
const { compressImage } = require('../utils/compressImage');

exports.getUsersForSidebar = catchAsync(async (req, res, next) => {
  const loggedInUserId = req.user._id;

  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select('-password');

  res.status(200).json(filteredUsers);
});

exports.getSearchedUsers = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  const { user } = req;

  const keyword = search
    ? {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  if (!keyword)
    return next(new AppError(404, "Enter user's email or username to serach "));

  const users = await User.find(keyword).find({ _id: { $ne: user?._id } });

  res.status(200).json(users);
});

exports.showProfile = catchAsync(async (req, res, next) => {
  if (!req.user._id) return next(new AppError(404, 'Missing user Id'));

  const user = await User.findById(req.user._id);

  if (!user) return next(new AppError(404, 'No user founded'));

  res.status(200).json({ user });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    message: 'data updated successfully',
    updatedUser,
  });
});

exports.addProfileImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError(404, 'No image provided'));

  const { secure_url, public_id } = await uploadImage(req);

  const updatedChat = await User.findByIdAndUpdate(
    req.user._id,
    {
      profileImage: {
        secure_url,
        public_id,
      },
    },
    { new: true },
  );

  res.status(200).json({ updatedChat });
});

exports.removeProfileImage = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  await destroy(user.profileImage.public_id);

  user.profileImage = {
    public_id: '',
    secure_url: '',
  };

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Image deleted successfully',
    user,
  });
});
