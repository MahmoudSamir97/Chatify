const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/userModel');
const generateTokenAndSetCookie = require('../utils/generateToken');
const { catchAsync } = require('../utils/error-handlers/catchAsync');
const Token = require('../models/tokenModel');
const sendeEmail = require('../services/sendEmail');
const verifyTemplate = require('../utils/email-templates/verifyTemplate');
const AppError = require('../utils/error-handlers/AppError');
const resetTemplate = require('../utils/email-templates/resetPasswordTemplate');

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const foundedUser = await User.findOne({ email });
  if (foundedUser) {
    return next(new AppError(400, 'User already exists'));
  }

  const salt = Number(process.env.BCRYPT_SALT);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ ...req.body, password: hashedPassword });

  const { token } = await Token.create({
    userId: user._id,
    token: crypto.randomBytes(32).toString('hex'),
  });
  const URL = `https://chatify-react.onrender.com/auth/${user._id}/verify/${token}`;
  sendeEmail(user, 'Verify email', verifyTemplate, URL);

  res.status(201).json({
    message: 'Please verify your email address',
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError(401, 'Invalid link'));

  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!token) return next(new AppError(401, 'User not found'));

  user.isVerified = true;
  await user.save();

  res.status(200).json({
    message: 'Email verified successfully',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError(401, 'Invalid email or password'));

  if (!user.isVerified)
    return next(new AppError(401, 'Please verify your email!'));

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch)
    return next(new AppError(401, 'Invalid email or password'));

  generateTokenAndSetCookie(user._id, res);

  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError(404, 'User with given email not exist'));

  let token = await Token.findOne({ userId: user._id });

  if (token) {
    if (token.hasExpired()) {
      token.createdAt = Date.now();
      await token.save();
    }
  } else {
    token = await Token.create({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    });
  }

  const URL = `https://chatify-react.onrender.com/auth/reset-password/${user._id}/${token.token}`;
  sendeEmail(user, 'Reset password', resetTemplate, URL);

  res.status(201).json({
    status: 'success',
    message: 'Check your email to reset your password!',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { user, token } = req.data;
  const { newPassword } = req.body;

  const salt = Number(process.env.BCRYPT_SALT);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();
  await Token.findByIdAndDelete(token._id);
  res
    .status(200)
    .json({ status: 'success', message: 'Password updated successfully!' });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', '', { maxAge: 0 });

  res.status(200).json({ message: 'Logged out successfully' });
});
