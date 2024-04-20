const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/userModel');
const generateTokenAndSetCookie = require('../utils/generateToken');
const { catchAsync } = require('../utils/catchAsync');
const Token = require('../models/tokenModel');
const sendeEmail = require('../services/sendEmail');
const verifyTemplate = require('../utils/verifyTemplate');
const AppError = require('../utils/AppError');

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // SEND FAIL IF USER EXIST
  const foundedUser = await User.findOne({ email });
  if (foundedUser) {
    return next(new AppError(400, 'User already exists'));
  }
  // HASH PASSWORD
  const salt = Number(process.env.BCRYPT_SALT);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ ...req.body, password: hashedPassword });

  // EMAIL VERIFICATION
  const { token } = await Token.create({
    userId: user._id,
    token: crypto.randomBytes(32).toString('hex'),
  });
  const url = `${process.env.BASE_URL}/user/${user._id}/verify/${token}`;
  sendeEmail(user.email, 'Verify email', verifyTemplate, url, user.username);

  // Generate JWT token here
  // generateTokenAndSetCookie(user._id, res);

  res.status(201).json({
    user,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1-) check if user exist
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError(401, 'Invalid email or password'));

  // 2-) check if user has verified email
  if (!user.isVerified)
    return next(new AppError(401, 'Please verify your email!'));

  // 3-) check if provided password is correct
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch)
    return next(new AppError(401, 'Invalid email or password'));

  // 4-) send token
  generateTokenAndSetCookie(user._id, res);
  res.status(200).json({
    _id: user._id,
    fullName: user.fullname,
    username: user.username,
    profilePic: user.profilePic,
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully' });
});

// const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
// const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
