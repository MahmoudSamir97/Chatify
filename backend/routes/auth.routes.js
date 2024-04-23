const authRouter = require('express').Router();
const {
  signup,
  login,
  logout,
  forgetPassword,
  resetPassword,
} = require('../controllers/authController');
const resetMiddleware = require('../middlewares/resetMiddleware');
const { validation } = require('../middlewares/validation');
const resetSchema = require('../utils/validation-schema/resetPasswordSchema');
const signupSchema = require('../utils/validation-schema/signupSchema');

authRouter.post('/signup', validation({ body: signupSchema }), signup);
authRouter.post('/login', login);
authRouter.post('/forget-password', forgetPassword);
authRouter.post('/logout', logout);
authRouter.post(
  '/reset-password/:id/:token',
  resetMiddleware,
  validation({ body: resetSchema }),
  resetPassword
);
module.exports = authRouter;
