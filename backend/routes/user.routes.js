const {
  verifyEmail,
  getUsersForSidebar,
} = require('../controllers/userController');
const protectRoute = require('../middlewares/protectRoute');

const userRouter = require('express').Router();
userRouter.get('/:id/verify/:token', verifyEmail);
userRouter.get('/conversations', protectRoute, getUsersForSidebar);
module.exports = userRouter;
