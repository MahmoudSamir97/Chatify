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

  const users = await User.find(keyword).find({ _id: { $ne: user?._id } });

  res.status(200).json(users);
});

exports.showProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  await user.save();
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { runValidators: true, new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'data updated successfully',
    updatedUser,
  });
});

exports.addProfileImage = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!req.file) next(new AppError(400, 'Profile picture not provided!'));

  const compressedImageBuffer = await compressImage(req.file.buffer);

  const mediaType = req.file.mimetype.split('/')[1].toUpperCase();
  const dataURI = imageDataURI.encode(compressedImageBuffer, mediaType);

  const { secure_url, public_id } = await uploadImage(dataURI);

  user.profileImage.secure_url = secure_url;
  user.profileImage.public_id = public_id;
  await user.save();

  res.status(201).json({
    status: 'success',
    message: 'Image added successfully',
    user,
  });
});

exports.removeProfileImage = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    profileImage: { secure_url: '', public_id: '' },
  });

  const result = await destroy(user.profileImage.public_id);

  res.status(200).json({
    status: 'success',
    message: 'Image deleted successfully',
    result,
  });
});
