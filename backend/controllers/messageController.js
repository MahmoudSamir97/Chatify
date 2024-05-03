const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const AppError = require('../utils/error-handlers/AppError');
const { catchAsync } = require('../utils/error-handlers/catchAsync');

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) return next(new AppError(400, 'No data provided'));

  let newMessage = await Message.create({
    sender: req.user._id,
    chat: chatId,
    content,
  });

  newMessage = await newMessage.populate('sender', 'username profileImage');

  newMessage = await newMessage.populate('chat');

  newMessage = await User.populate(newMessage, {
    path: 'chat.users',
    select: 'username profileImage email',
  });

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: newMessage._id,
  });

  res.status(200).json({ newMessage });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;

  if (!chatId) return next(new AppError(400, 'No Chat id provided'));

  const messages = await Message.find({ chat: chatId })
    .populate('sender', 'username profileImage email')
    .populate('chat');

  if (!messages) return next(new AppError(404, 'No messages founded'));

  res.status(200).json({ messages });
});
