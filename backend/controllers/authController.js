const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const generateTokenAndSetCookie = require('../utils/generateToken');
const { catchAsync } = require('../utils/error-handlers/catchAsync');
const Token = require('../models/tokenModel');
const sendeEmail = require('../services/sendEmail');
const verifyTemplate = require('../utils/email-templates/verifyTemplate');
const AppError = require('../utils/error-handlers/AppError');
const resetTemplate = require('../utils/email-templates/resetPasswordTemplate');
const { validation } = require('../middlewares/validation');
const resetSchema = require('../utils/validation-schema/resetPasswordSchema');

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
  const URL = `${process.env.BASE_URL}/user/${user._id}/verify/${token}`;
  sendeEmail(user, 'Verify email', verifyTemplate, URL);
  res.status(201).json({
    message: 'Please verify your email address',
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
  // generateTokenAndSetCookie(user._id, res);
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.COOKIE_EXPIRES,
  });

  res.status(200).json({
    user,
    token,
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1- GET USER BY POSTED EMAIL
  console.log(req.body.email, 'from forgetPassword function');
  const user = await User.findOne({ email: req.body.email });
  console.log(user, 'from forgetPassword function');
  if (!user) return next(new AppError(404, 'User with given email not exist'));

  // Find the existing token for the user
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    if (token.hasExpired()) {
      token.createdAt = Date.now();
      await token.save();
    }
    // if not expired do nothing
  } else {
    // 2-GENERATE NEW TOKEN
    token = await Token.create({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    });
  }
  // 3-SEND RESET TOKEN THROUGH EMAIL
  const URL = `${process.env.BASE_URL}/auth/reset-password/${user._id}/${token.token}`;
  sendeEmail(user, 'Reset password', resetTemplate, URL);

  res.status(201).json({
    status: 'success',
    message: 'Check your email to reset your password!',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  /* ADD NEW PASSWORD */
  const { user, token } = req.data;
  const { newPassword } = req.body;
  // Hash new Password
  const salt = Number(process.env.BCRYPT_SALT);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  // Save
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
