const chatRouter = require('express').Router();
const upload = require('../middlewares/multer');
const findPrivateChat = require('../middlewares/findChat');
const groupValidator = require('../middlewares/groupValidator');
const protectRoute = require('../middlewares/protectRoute');
const {
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  createPrivateChat,
  changeGroupImage,
  deleteGroup,
} = require('../controllers/chatController');

chatRouter.use(protectRoute);

chatRouter.route('/').get(fetchChats).post(findPrivateChat, createPrivateChat);
chatRouter.post(
  '/create-group',
  upload.single('groupImage'),
  groupValidator,
  createGroupChat
);
chatRouter.patch('/rename-group', renameGroup);
chatRouter.patch('/add-user', addToGroup);
chatRouter.patch('/remove-user', removeFromGroup);
chatRouter.patch('/update-image', upload.single('chatImage'), changeGroupImage);
chatRouter.post('/delete-group', deleteGroup);

module.exports = chatRouter;
