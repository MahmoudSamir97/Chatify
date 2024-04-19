const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const { catchAsync } = require('../utils/catchAsync.js');

const protectRoute = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No Token Provided' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
  }

  const user = await User.findById(decoded.userId).select('-password');

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  req.user = user;

  next();
});

module.exports = protectRoute;
