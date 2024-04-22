const authRouter = require('express').Router();
const { signup, login, logout } = require('../controllers/authController');
const { validation } = require('../middlewares/validation');
const signupSchema = require('../utils/signupSchema');

authRouter.post('/signup', validation({ body: signupSchema }), signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
module.exports = authRouter;
