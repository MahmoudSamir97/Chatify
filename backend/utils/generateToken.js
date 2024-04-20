const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.COOKIE_EXPIRES,
  });

  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true,
    sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== 'development',
  });
};

module.exports = generateTokenAndSetCookie;
