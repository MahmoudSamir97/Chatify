const messageRouter = require('express').Router();
const {
  getMessages,
  sendMessage,
} = require('../controllers/messageController');
const protectRoute = require('../middlewares/protectRoute');

messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.post('/send/:id', protectRoute, sendMessage);

module.exports = messageRouter;
