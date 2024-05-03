const messageRouter = require('express').Router();
const {
  getMessages,
  sendMessage,
} = require('../controllers/messageController');
const protectRoute = require('../middlewares/protectRoute');

messageRouter.use(protectRoute);

messageRouter.get('/:chatId', getMessages);
messageRouter.post('/', sendMessage);

module.exports = messageRouter;
