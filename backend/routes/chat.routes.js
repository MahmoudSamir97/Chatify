const chatRouter = require('express').Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require('../controllers/chatController');
const protectRoute = require('../middlewares/protectRoute');

chatRouter.use(protectRoute);

chatRouter.route('/').post(accessChat);
chatRouter.route('/').get(fetchChats);
chatRouter.route('/group').post(createGroupChat);
chatRouter.route('/rename').put(renameGroup);
chatRouter.route('/groupremove').put(removeFromGroup);
chatRouter.route('/groupadd').put(addToGroup);

module.exports = chatRouter;
