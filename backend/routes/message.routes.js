const messageRouter = require('express').Router();
const protectRoute = require('../middlewares/protectRoute');
const {
  getMessages,
  sendMessage,
} = require('../controllers/messageController');

messageRouter.use(protectRoute);

messageRouter.get('/:chatId', getMessages);

messageRouter.post('/', sendMessage);

module.exports = messageRouter;
