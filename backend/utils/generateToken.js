const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.COOKIE_EXPIRES,
  });

  res.cookie('token', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
};

module.exports = generateTokenAndSetCookie;
