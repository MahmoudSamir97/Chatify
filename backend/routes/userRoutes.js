const { verifyEmail } = require('../controllers/userController');

const userRouter = require('express').Router();
userRouter.get('/:id/verify/:token', verifyEmail);

module.exports = userRouter;
