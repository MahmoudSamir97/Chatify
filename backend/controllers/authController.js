const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const generateTokenAndSetCookie = require('../utils/generateToken');
const { catchAsync } = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const { fullName, username, password, confirmPassword, gender } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords don,t match' });
  }

  const user = await User.findOne({ username });

  if (user) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // HASH PASSWORD HERE
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // https://avatar-placeholder.iran.liara.run/

  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

  const newUser = new User({
    fullName,
    username,
    password: hashedPassword,
    gender,
    profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
  });

  if (newUser) {
    // Generate JWT token here
    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic,
    });
  } else {
    res.status(400).json({ error: 'Invalid user data' });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user?.password || ''
  );

  if (!user || !isPasswordCorrect) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  generateTokenAndSetCookie(user._id, res);

  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    profilePic: user.profilePic,
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully' });
});
